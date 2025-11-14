import { Router } from 'express';
import dotenv from 'dotenv';
import { ChatTokenBuilder } from 'agora-token';

dotenv.config();

const router = Router();

// GET /agora/token?userId=alice
router.get('/token', (req, res) => {
  const userId = String(req.query.userId || '');
  if (!userId) return res.status(400).json({ error: 'query param userId is required' });

  const appId = process.env.AGORA_APP_ID;
  const appCertificate = process.env.AGORA_APP_CERTIFICATE;
  if (!appId || !appCertificate) {
    return res.status(500).json({ error: 'AGORA_APP_ID or AGORA_APP_CERTIFICATE not configured on server' });
  }

  try {
    const nowSeconds = Math.floor(Date.now() / 1000);
    const expireSeconds = Number(process.env.AGORA_TOKEN_EXPIRE_SECONDS) || 3600; // 1 hour default
    const expireTimestamp = nowSeconds + expireSeconds;

    // Build a Chat user token compatible with the `agora-chat` web SDK
    const token = ChatTokenBuilder.buildUserToken(appId, appCertificate, userId, expireTimestamp);

    return res.json({ token, appId, userId, expireTimestamp });
  } catch (err: any) {
    return res.status(500).json({ error: String(err?.message || err) });
  }
});

export default router;
