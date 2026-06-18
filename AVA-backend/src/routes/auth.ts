import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'ava-secret-change-in-prod';

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { prenom, nom, email, tel, password } = req.body;
    if (!prenom || !nom || !email || !password) {
      return res.status(400).json({ error: 'Champs obligatoires manquants.' });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: 'Email déjà utilisé.' });
    const hash = await bcrypt.hash(password, 12);
    const user = await User.create({ prenom, nom, email, tel, password: hash });
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '30d' });
    res.status(201).json({ token, user: { id: user._id, prenom, nom, email } });
  } catch (e) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.password) return res.status(401).json({ error: 'Identifiants incorrects.' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Identifiants incorrects.' });
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, user: { id: user._id, prenom: user.prenom, nom: user.nom, email: user.email } });
  } catch (e) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

router.post('/google', async (_req: Request, res: Response) => {
  res.status(501).json({ error: 'Google OAuth — configurer CLIENT_ID Google Cloud Console.' });
});

router.post('/apple', async (_req: Request, res: Response) => {
  res.status(501).json({ error: 'Apple OAuth — configurer clé .p8 Apple Developer Console.' });
});

export default router;
