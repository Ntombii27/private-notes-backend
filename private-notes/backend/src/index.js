import 'dotenv/config'; // must stay first so env vars exist for the imports below
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import noteRoutes from './routes/notes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Needed on Render/Railway so Express knows it's behind HTTPS and sets secure cookies.
app.set('trust proxy', 1);

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true, // lets the browser send our cookie along
  })
);
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

app.use((req, res) => res.status(404).json({ error: 'Route not found.' }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on our side.' });
});

app.listen(PORT, () => console.log(`API running on port ${PORT}`));
