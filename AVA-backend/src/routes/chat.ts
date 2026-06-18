import { Router, Request, Response } from 'express';
import TelegramBot from 'node-telegram-bot-api';

const router = Router();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

let bot: TelegramBot | null = null;
if (BOT_TOKEN) {
  bot = new TelegramBot(BOT_TOKEN, { polling: false });
}

router.post('/message', async (req: Request, res: Response) => {
  try {
    const { message, userId } = req.body;
    if (!message) return res.status(400).json({ error: 'Message requis.' });

    if (!bot || !CHAT_ID) {
      return res.json({
        reply: "Je comprends. Consultez l'onglet Ressources pour les informations juridiques et les numéros d'urgence. [Mode démo — bot Telegram non configuré]",
      });
    }

    await bot.sendMessage(CHAT_ID, `[AVA - Utilisateur ${userId}]\n${message}`);
    res.json({ reply: "Votre message a été transmis. Vous recevrez une réponse de votre avocat sous peu." });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erreur lors de l\'envoi du message.' });
  }
});

export default router;
