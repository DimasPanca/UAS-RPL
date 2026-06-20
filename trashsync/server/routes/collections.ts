import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, bin_id AS "binId", bin_name AS "binName",
         completed_at AS "completedAt", petugas_id AS "petugasId",
         petugas_name AS "petugasName", notes, fill_before AS "fillBefore"
       FROM collection_history
       ORDER BY completed_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
