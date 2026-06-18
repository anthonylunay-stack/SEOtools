import { Router, Request, Response } from 'express';
import TelegramBot from 'node-telegram-bot-api';

const router = Router();

// Map userId -> SSE response (pour streaming en temps réel)
const clients = new Map<string, Response>();

export function registerClient(userId: string, res: Response) {
  clients.set(userId, res);
}

export function removeClient(userId: string) {
  clients.delete(userId);
}

export function sendToClient(userId: string, message: string) {
  const res = clients.get(userId);
  if (res) {
    res.write(`data: ${JSON.stringify({ reply: message })}\n\n`);
  }
}

// Webhook Telegram : reçoit les réponses du bot et les renvoie à l'app
router.post('/telegram', (req: Request, res: Response) => {
  const update = req.body;
  if (update?.message?.text) {
    const text: string = update.message.text;
    // Format attendu du bot: "[userId] réponse..."
    const match = text.match(/^\[([^\]]+)\]\s*(.*)/s);
    if (match) {
      const userId = match[1];
      const reply = match[2];
      sendToClient(userId, reply);
    } else {
      // Diffuse à tous les clients connectés si pas de userId
      clients.forEach((clientRes) => {
        clientRes.write(`data: ${JSON.stringify({ reply: text })}\n\n`);
      });
    }
  }
  res.sendStatus(200);
});

// SSE endpoint : l'app mobile écoute les réponses en temps réel
router.get('/listen/:userId', (req: Request, res: Response) => {
  const { userId } = req.params;
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();
  registerClient(userId, res);
  req.on('close', () => removeClient(userId));
});

export default router;
