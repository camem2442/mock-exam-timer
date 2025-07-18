import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from '@neondatabase/serverless';
import { nanoid } from 'nanoid';
import { createHash } from 'crypto';

// 객체의 키를 정렬하여 일관된 JSON 문자열을 생성하는 함수
const stableStringify = (obj: any): string => {
  const allKeys: string[] = [];
  JSON.stringify(obj, (key, value) => {
    allKeys.push(key);
    return value;
  });
  allKeys.sort();
  return JSON.stringify(obj, allKeys);
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ error: 'DATABASE_URL is not configured' });
  }
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    const examData = req.body;
    if (!examData || typeof examData !== 'object' || Object.keys(examData).length === 0) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    // 데이터의 해시 생성
    const dataString = stableStringify(examData);
    const dataHash = createHash('sha256').update(dataString).digest('hex');

    const client = await pool.connect();
    try {
      // 1. 해시 값으로 기존 데이터 검색
      const existingResult = await client.query('SELECT id FROM results WHERE data_hash = $1', [dataHash]);

      if (existingResult.rows.length > 0) {
        // 2. 데이터가 이미 존재하면 기존 ID 반환 (200 OK)
        return res.status(200).json({ id: existingResult.rows[0].id });
      }

      // 3. 데이터가 없으면 새로 생성
      const id = nanoid(12);
      const query = {
        text: 'INSERT INTO results (id, data, data_hash) VALUES ($1, $2, $3)',
        values: [id, JSON.stringify(examData), dataHash],
      };
      await client.query(query);
      
      // 4. 새로 생성된 ID 반환 (201 Created)
      return res.status(201).json({ id });

    } finally {
      client.release();
      await pool.end();
    }

  } catch (error) {
    console.error('Error saving result:', error);
    return res.status(500).json({ error: 'Failed to save result' });
  }
} 