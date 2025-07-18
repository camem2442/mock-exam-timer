import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from '@neondatabase/serverless';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. GET 요청만 허용
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 2. ID 파라미터 확인
  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'ID parameter is required' });
  }

  // 3. 데이터베이스 연결 설정
  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ error: 'DATABASE_URL is not configured' });
  }
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    // 4. 데이터베이스에서 데이터 조회
    const client = await pool.connect();
    try {
      const query = {
        text: 'SELECT data FROM results WHERE id = $1',
        values: [id],
      };
      const { rows } = await client.query(query);

      // 5. 결과 반환
      if (rows.length > 0) {
        // data 컬럼의 JSON 객체를 바로 반환
        return res.status(200).json(rows[0].data);
      } else {
        return res.status(404).json({ error: 'Result not found' });
      }
    } finally {
      client.release();
      await pool.end();
    }
  } catch (error) {
    console.error('Error fetching result:', error);
    return res.status(500).json({ error: 'Failed to fetch result' });
  }
} 