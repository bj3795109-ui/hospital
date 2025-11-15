import { Router } from 'express';
import { getDb } from '../db';
import { ObjectId } from 'mongodb';

const router = Router();

const DEFAULT_REDEEM_COST = Number(process.env.REDEEM_COST) || 500;

// GET /rewards - fetch global account points and redemptions
router.get('/', async (_req, res) => {
  try {
    const db = getDb();
    const filter = { key: 'global' };
    const account = await db.collection('account').findOne(filter);
    const redemptions = await db.collection('vouchers').find({ key: 'global' }).sort({ createdAt: -1 }).toArray();

    res.json({ account: account || { points: 0 }, redemptions });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch rewards' });
  }
});

// POST /rewards/redeem - redeem points for a voucher
// POST /rewards/redeem - redeem points for a voucher on global account
router.post('/redeem', async (req, res) => {
  try {
    const { cost } = req.body;
    const redeemCost = Number(cost) || DEFAULT_REDEEM_COST;

    const db = getDb();
    const filter = { key: 'global' };
    const account = await db.collection('account').findOne(filter);
    const currentPoints = (account && typeof account.points === 'number') ? account.points : 0;
    if (currentPoints < redeemCost) {
      return res.status(400).json({ error: 'Insufficient points', points: currentPoints });
    }

    // Deduct points and create voucher
    await db.collection('account').updateOne(filter, { $inc: { points: -redeemCost } });

    const voucherCode = `VCHR-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const voucher = {
      key: 'global',
      code: voucherCode,
      cost: redeemCost,
      createdAt: new Date(),
    };
    const result = await db.collection('vouchers').insertOne(voucher);

    const updatedAccount = await db.collection('account').findOne(filter);
    res.json({ success: true, voucher: { _id: result.insertedId, ...voucher }, account: updatedAccount });
  } catch (err) {
    console.error('Redeem error', err);
    res.status(500).json({ error: 'Failed to redeem voucher' });
  }
});

// POST /rewards/award - award points to the global account (used for achievements)
router.post('/award', async (req, res) => {
  try {
    const { points } = req.body;
    const pts = Number(points) || 0;
    if (pts <= 0) return res.status(400).json({ error: 'Invalid points' });

    const db = getDb();
    const filter = { key: 'global' };
    // ensure account exists and increment points
    await db.collection('account').updateOne(filter, { $inc: { points: pts } }, { upsert: true });
    const updatedAccount = await db.collection('account').findOne(filter);
    res.json({ success: true, account: updatedAccount });
  } catch (err) {
    console.error('Award error', err);
    res.status(500).json({ error: 'Failed to award points' });
  }
});

export default router;
