import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email dan password wajib diisi' });
  }
  try {
    const { rows } = await pool.query(
      `SELECT id, name, email, role, status, avatar
       FROM users
       WHERE email = $1 AND password = $2 AND status = 'Aktif'`,
      [email, password]
    );
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Email atau password salah, atau akun tidak aktif' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
