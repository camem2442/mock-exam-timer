import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from '@neondatabase/serverless';
import { nanoid } from 'nanoid';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. POST 요청만 허용
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 2. 데이터베이스 연결 설정
  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ error: 'DATABASE_URL is not configured' });
  }
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    const examData = req.body;

    // 3. 요청 본문 유효성 검사 (간단하게)
    if (!examData || typeof examData !== 'object' || Object.keys(examData).length === 0) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    // 4. 고유 ID 생성
    const id = nanoid(12); // 12자리 무작위 ID 생성

    // 5. 데이터베이스에 데이터 저장
    const client = await pool.connect();
    try {
      const query = {
        text: 'INSERT INTO results (id, data) VALUES ($1, $2)',
        values: [id, JSON.stringify(examData)],
      };
      await client.query(query);
    } finally {
      client.release();
      await pool.end();
    }

    // 6. 성공 응답 (생성된 ID 포함)
    return res.status(201).json({ id });

  } catch (error) {
    console.error('Error saving result:', error);
    return res.status(500).json({ error: 'Failed to save result' });
  }
} 