import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

const SELECT_USER = `
  SELECT id, name, email, role, status, avatar
  FROM users
  ORDER BY role, name
`;

router.get('/', async (_req, res) => {
  try {
    const { rows } = await pool.query(SELECT_USER);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  const { name, email, role, status, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Nama, email, dan password wajib diisi' });
  }
  try {
    const { rows } = await pool.query(
      `INSERT INTO users (id, name, email, role, status, password)
       VALUES ('user-' || floor(extract(epoch from now()) * 1000)::text, $1, $2, $3, $4, $5)
       RETURNING id, name, email, role, status, avatar`,
      [name, email, role || 'warga', status || 'Aktif', password]
    );
    res.status(201).json(rows[0]);
  } catch (err: any) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Email sudah digunakan' });
    }
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, role, status, password } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Nama dan email wajib diisi' });

  try {
    let query: string;
    let params: unknown[];
    if (password) {
      query = `UPDATE users SET name=$1, email=$2, role=$3, status=$4, password=$5 WHERE id=$6
               RETURNING id, name, email, role, status, avatar`;
      params = [name, email, role, status, password, id];
    } else {
      query = `UPDATE users SET name=$1, email=$2, role=$3, status=$4 WHERE id=$5
               RETURNING id, name, email, role, status, avatar`;
      params = [name, email, role, status, id];
    }
    const { rows } = await pool.query(query, params);
    if (rows.length === 0) return res.status(404).json({ error: 'User tidak ditemukan' });
    res.json(rows[0]);
  } catch (err: any) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Email sudah digunakan' });
    }
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE users SET status=$1 WHERE id=$2 RETURNING id, name, email, role, status, avatar`,
      [status, id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'User tidak ditemukan' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
