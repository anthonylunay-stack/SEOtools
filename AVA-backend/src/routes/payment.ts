import { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import User from '../models/User';

const router = Router();

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

const PRICE_ID = process.env.STRIPE_PRICE_ID || '';
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';
const VALID_CODES = ['AVA-FREE', 'AVA-TEST', 'AVA-DEMO'];

router.post('/validate-code', async (req: Request, res: Response) => {
  const { code } = req.body;
  if (VALID_CODES.includes((code || '').toUpperCase())) {
    res.json({ valid: true });
  } else {
    res.status(400).json({ valid: false, error: 'Code invalide ou expiré.' });
  }
});

router.post('/subscribe', async (req: Request, res: Response) => {
  if (!stripe) return res.status(501).json({ error: 'Stripe non configuré.' });
  try {
    const { paymentMethodId, userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé.' });

    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({ email: user.email, name: `${user.prenom} ${user.nom}` });
      customerId = customer.id;
      user.stripeCustomerId = customerId;
    }

    await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });
    await stripe.customers.update(customerId, { invoice_settings: { default_payment_method: paymentMethodId } });

    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: PRICE_ID }],
      expand: ['latest_invoice.payment_intent'],
    });

    user.stripeSubscriptionId = subscription.id;
    user.subscriptionStatus = 'active';
    await user.save();

    res.json({ subscriptionId: subscription.id, status: subscription.status });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/cancel', async (req: Request, res: Response) => {
  if (!stripe) return res.status(501).json({ error: 'Stripe non configuré.' });
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user?.stripeSubscriptionId) return res.status(404).json({ error: 'Abonnement non trouvé.' });
    await stripe.subscriptions.update(user.stripeSubscriptionId, { cancel_at_period_end: true });
    user.subscriptionStatus = 'cancelled';
    await user.save();
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/webhook', async (req: Request, res: Response) => {
  if (!stripe || !WEBHOOK_SECRET) return res.sendStatus(400);
  const sig = req.headers['stripe-signature'] as string;
  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, WEBHOOK_SECRET);
    if (event.type === 'invoice.payment_succeeded') {
      const invoice = event.data.object as Stripe.Invoice;
      if (invoice.customer) {
        await User.findOneAndUpdate({ stripeCustomerId: invoice.customer }, { subscriptionStatus: 'active' });
      }
    }
    res.json({ received: true });
  } catch (e: any) {
    res.status(400).send(`Webhook Error: ${e.message}`);
  }
});

export default router;
