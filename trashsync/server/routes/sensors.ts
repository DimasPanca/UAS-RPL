import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT bin_id AS "binId", reading_date::text AS date, fill_level AS "fillLevel"
       FROM sensor_readings
       ORDER BY reading_date ASC`
    );

    // Group by date → { date, fills: { binId: fillLevel } }
    const grouped: Record<string, Record<string, number>> = {};
    for (const row of rows) {
      if (!grouped[row.date]) grouped[row.date] = {};
      grouped[row.date][row.binId] = row.fillLevel;
    }

    const result = Object.entries(grouped).map(([date, fills]) => ({ date, fills }));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
