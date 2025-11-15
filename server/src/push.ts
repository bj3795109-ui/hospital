import webpush, { PushSubscription } from 'web-push'
import cron from 'node-cron'
import { getDb } from './db'

const VAPID_PUBLIC = process.env.VAPID_PUBLIC_KEY || ''
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY || ''
const VAPID_EMAIL = process.env.VAPID_EMAIL || 'mailto:admin@example.com'

if (VAPID_PUBLIC && VAPID_PRIVATE) {
  webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC, VAPID_PRIVATE)
} else {
  console.warn('VAPID keys not set. Push notifications will not work until VAPID keys are configured.')
}

type PushSubscriptionJSON = PushSubscription

// Save subscription
export async function saveSubscription(sub: PushSubscriptionJSON) {
  try {
    const db = getDb()
    await db
      .collection('pushSubscriptions')
      .updateOne({ endpoint: sub.endpoint }, { $set: sub }, { upsert: true })
    return true
  } catch (e) {
    console.error('Failed to save subscription', e)
    return false
  }
}

// Get all subscriptions
export async function getSubscriptions(): Promise<PushSubscriptionJSON[]> {
  const db = getDb()
  return db.collection('pushSubscriptions').find({}).toArray()
}

// Send a notification and remove invalid subscriptions
export async function sendNotification(sub: PushSubscriptionJSON, payload: any) {
  if (!VAPID_PUBLIC || !VAPID_PRIVATE) return
  try {
    await webpush.sendNotification(sub, typeof payload === 'string' ? payload : JSON.stringify(payload))
  } catch (err: any) {
    console.error('Push send error', err)
    if (err.statusCode === 410 || err.statusCode === 404) {
      // Subscription is no longer valid, remove it
      const db = getDb()
      await db.collection('pushSubscriptions').deleteOne({ endpoint: sub.endpoint })
      console.log(`Removed invalid subscription: ${sub.endpoint}`)
    }
  }
}

// Schedule notifications for medications using cron
export async function scheduleAllNotifications() {
  try {
    const db = getDb()
    const meds = await db.collection('medications').find({}).toArray()

    for (const med of meds) {
      if (!med.time || !med._id) continue
      const [hour, minute] = med.time.split(':').map(Number)
      if (isNaN(hour) || isNaN(minute)) continue

      // Schedule using cron (runs every day at specified hour and minute)
      const cronExpression = `${minute} ${hour} * * *`
      cron.schedule(cronExpression, async () => {
        try {
          const subs = await getSubscriptions()
          const payload = {
            title: `Medication: ${med.name}`,
            body: `${med.dose} — Time to take your medication.`,
            data: { medId: med._id }
          }
          // Send notifications in parallel
          await Promise.all(subs.map(s => sendNotification(s, payload)))
          console.log(`Sent notification for med ${med._id} at ${new Date().toISOString()}`)
        } catch (e) {
          console.error('Scheduled push error', e)
        }
      })

      console.log(`Scheduled cron notification for med ${med._id} at ${med.time}`)
    }
  } catch (e) {
    console.error('Failed to schedule notifications', e)
  }
}

export { VAPID_PUBLIC }
