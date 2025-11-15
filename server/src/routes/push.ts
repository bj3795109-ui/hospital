import { Router } from 'express'
import { saveSubscription, VAPID_PUBLIC } from '../push'

const router = Router()

// POST /push/subscribe - save the push subscription from the client
router.post('/subscribe', async (req, res) => {
  try {
    const sub = req.body
    const ok = await saveSubscription(sub)
    if (ok) return res.json({ success: true })
    return res.status(500).json({ error: 'Failed to save subscription' })
  } catch (e) {
    console.error('Subscribe error', e)
    res.status(500).json({ error: 'Subscribe failed' })
  }
})

// GET /push/vapid - return VAPID public key for client subscription
router.get('/vapid', (_req, res) => {
  res.json({ publicKey: VAPID_PUBLIC || '' })
})

export default router
