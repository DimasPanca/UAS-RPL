import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth.js';
import binsRouter from './routes/bins.js';
import usersRouter from './routes/users.js';
import reportsRouter from './routes/reports.js';
import collectionsRouter from './routes/collections.js';
import sensorsRouter from './routes/sensors.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/bins', binsRouter);
app.use('/api/users', usersRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/collections', collectionsRouter);
app.use('/api/sensors', sensorsRouter);

app.listen(PORT, () => {
  console.log(`TrashSync API berjalan di http://localhost:${PORT}`);
});
