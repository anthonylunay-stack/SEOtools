import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRouter from './routes/auth';
import chatRouter from './routes/chat';
import paymentRouter from './routes/payment';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use('/payment/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

app.get('/', (_req, res) => res.json({ status: 'AVA Backend OK', version: '1.0.0' }));
app.use('/auth', authRouter);
app.use('/chat', chatRouter);
app.use('/payment', paymentRouter);

const MONGODB_URI = process.env.MONGODB_URI || '';
if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB connecté'))
    .catch(e => console.error('MongoDB erreur:', e));
} else {
  console.warn('MONGODB_URI non défini — démarrage sans base de données');
}

app.listen(PORT, () => console.log(`AVA Backend démarré sur le port ${PORT}`));
