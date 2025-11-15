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

// POST /agora/ai - ask the AI to reply in a conversation
router.post('/ai', async (req, res) => {
  const { userId, conversationId, message } = req.body || {}
  if (!userId || !conversationId || !message) return res.status(400).json({ error: 'userId, conversationId and message are required' })

  const appId = process.env.AGORA_APP_ID
  const appCertificate = process.env.AGORA_APP_CERTIFICATE
  if (!appId || !appCertificate) {
    return res.status(500).json({ error: 'AGORA_APP_ID or AGORA_APP_CERTIFICATE not configured on server' })
  }

  const botId = process.env.AGORA_BOT_ID || 'ai-bot'

  // Generate AI reply: OpenAI if key present, otherwise canned fallback
  let replyText = ''
  try {
    const openaiKey = process.env.OPENAI_API_KEY
    if (openaiKey) {
      // Call OpenAI Chat Completions API (gpt-3.5-turbo)
      const body = {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful and compassionate health assistant. Give concise, safe, and actionable responses. If user asks for medical emergencies, advise to seek immediate medical help.' },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 400
      }
      const r = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify(body),
      })
      const data: any = await r.json()
      replyText = data?.choices?.[0]?.message?.content || ''
    } else {
      // Fallback canned reply
      replyText = `Thanks for your message: "${String(message).slice(0, 200)}". I don't have an LLM key configured right now, but here's a general suggestion: stay consistent with your medications, track symptoms, and contact your healthcare provider for anything urgent.`
    }
  } catch (e) {
    console.error('AI generation error', e)
    replyText = `Sorry, I couldn't generate a reply right now. Please try again later.`
  }

  // Posting bot messages into Agora conversations requires using the Agora Chat server SDK
  // or REST API. The `agora-chat` package is browser-focused and can throw at import time
  // in a Node environment (it references `self`). To avoid startup runtime errors we skip
  // posting here when running in Node. You can enable server-side posting later via the
  // Agora Chat REST API or a server-supported SDK.
  (async () => {
    try {
      console.info('Skipping Agora SDK bot post: server environment may not support `agora-chat` package')
    } catch (e) {
      console.warn('Skipping Agora bot post encountered error', e)
    }
  })()

  return res.json({ reply: replyText })
})
