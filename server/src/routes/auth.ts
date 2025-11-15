import { Router } from 'express'
import { getDb } from '../db'
import jwt from 'jsonwebtoken'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'
const JWT_EXP = process.env.JWT_EXP || '7d'

// POST /auth/login - simple email/password login (creates user if not exists)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email) return res.status(400).json({ error: 'Email required' })

    const db = getDb()
    let user = await db.collection('users').findOne({ email })
    if (!user) {
      const now = new Date()
      const result = await db.collection('users').insertOne({ email, password: password || null, createdAt: now })
      user = { _id: result.insertedId, email }
    }

    // NOTE: This is a simple example. In production store hashed passwords and verify them securely.
    const token = jwt.sign({ sub: String(user._id), email }, JWT_SECRET, { expiresIn: JWT_EXP })
    res.json({ success: true, token, user: { _id: user._id, email: user.email } })
  } catch (e) {
    console.error('Auth error', e)
    res.status(500).json({ error: 'Login failed' })
  }
})

export default router
