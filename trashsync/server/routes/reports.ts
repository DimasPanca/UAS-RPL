import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

const SELECT_REPORT = `
  SELECT id, reporter_id AS "reporterId", reporter_name AS "reporterName",
    bin_id AS "binId", bin_name AS "binName",
    category, description, photo_name AS "photoName",
    submitted_at AS "submittedAt", status
  FROM reports
  ORDER BY submitted_at DESC
`;

router.get('/', async (_req, res) => {
  try {
    const { rows } = await pool.query(SELECT_REPORT);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  const { reporterId, reporterName, binId, binName, category, description, photoName } = req.body;
  if (!reporterId || !binId || !category || !description) {
    return res.status(400).json({ error: 'Data laporan tidak lengkap' });
  }
  const repId = `rep-${Date.now()}`;
  try {
    const { rows } = await pool.query(
      `INSERT INTO reports (id, reporter_id, reporter_name, bin_id, bin_name, category, description, photo_name)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, reporter_id AS "reporterId", reporter_name AS "reporterName",
         bin_id AS "binId", bin_name AS "binName",
         category, description, photo_name AS "photoName",
         submitted_at AS "submittedAt", status`,
      [repId, reporterId, reporterName, binId, binName, category, description, photoName || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const allowed = ['Pending', 'Terverifikasi', 'Ditolak'];
  if (!allowed.includes(status)) return res.status(400).json({ error: 'Status tidak valid' });
  try {
    const { rows } = await pool.query(
      `UPDATE reports SET status=$1 WHERE id=$2
       RETURNING id, reporter_id AS "reporterId", reporter_name AS "reporterName",
         bin_id AS "binId", bin_name AS "binName",
         category, description, photo_name AS "photoName",
         submitted_at AS "submittedAt", status`,
      [status, id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Laporan tidak ditemukan' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
