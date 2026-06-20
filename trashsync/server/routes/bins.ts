import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

const SELECT_BIN = `
  SELECT id, name, location, coordinates,
    max_capacity AS "maxCapacity",
    current_fill  AS "currentFill",
    last_updated  AS "lastUpdated",
    status
  FROM trash_bins
  ORDER BY name
`;

const computeStatus = (fill: number) =>
  fill >= 80 ? 'penuh' : fill >= 50 ? 'waspada' : 'aman';

router.get('/', async (_req, res) => {
  try {
    const { rows } = await pool.query(SELECT_BIN);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  const { name, location, coordinates, maxCapacity, currentFill } = req.body;
  if (!name || !location) return res.status(400).json({ error: 'Nama dan lokasi wajib diisi' });
  const fill = Number(currentFill) || 0;
  const status = computeStatus(fill);
  try {
    const { rows } = await pool.query(
      `INSERT INTO trash_bins (id, name, location, coordinates, max_capacity, current_fill, status)
       VALUES ('bin-' || floor(extract(epoch from now()) * 1000)::text, $1, $2, $3, $4, $5, $6)
       RETURNING id, name, location, coordinates,
         max_capacity AS "maxCapacity", current_fill AS "currentFill",
         last_updated AS "lastUpdated", status`,
      [name, location, coordinates || '', Number(maxCapacity) || 100, fill, status]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, location, coordinates, maxCapacity, currentFill } = req.body;
  if (!name || !location) return res.status(400).json({ error: 'Nama dan lokasi wajib diisi' });
  const fill = Number(currentFill);
  const status = computeStatus(fill);
  try {
    const { rows } = await pool.query(
      `UPDATE trash_bins
       SET name=$1, location=$2, coordinates=$3, max_capacity=$4,
           current_fill=$5, status=$6, last_updated=NOW()
       WHERE id=$7
       RETURNING id, name, location, coordinates,
         max_capacity AS "maxCapacity", current_fill AS "currentFill",
         last_updated AS "lastUpdated", status`,
      [name, location, coordinates || '', Number(maxCapacity) || 100, fill, status, id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Bin tidak ditemukan' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM trash_bins WHERE id=$1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:id/collect', async (req, res) => {
  const { id } = req.params;
  const { petugasId, petugasName } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { rows: binRows } = await client.query(
      `SELECT id, name, current_fill AS "currentFill" FROM trash_bins WHERE id=$1`,
      [id]
    );
    if (binRows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Bin tidak ditemukan' });
    }

    const fillBefore = binRows[0].currentFill;
    const colId = `col-${Date.now()}`;

    const { rows: updatedBin } = await client.query(
      `UPDATE trash_bins
       SET current_fill=0, status='aman', last_updated=NOW()
       WHERE id=$1
       RETURNING id, name, location, coordinates,
         max_capacity AS "maxCapacity", current_fill AS "currentFill",
         last_updated AS "lastUpdated", status`,
      [id]
    );

    const { rows: newCollection } = await client.query(
      `INSERT INTO collection_history (id, bin_id, bin_name, petugas_id, petugas_name, fill_before)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, bin_id AS "binId", bin_name AS "binName",
         completed_at AS "completedAt", petugas_id AS "petugasId",
         petugas_name AS "petugasName", notes, fill_before AS "fillBefore"`,
      [colId, id, binRows[0].name, petugasId, petugasName, fillBefore]
    );

    await client.query('COMMIT');
    res.json({ bin: updatedBin[0], collection: newCollection[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.release();
  }
});

export default router;
