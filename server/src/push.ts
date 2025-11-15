import webpush from 'web-push'
import { getDb } from './db'

const VAPID_PUBLIC = process.env.VAPID_PUBLIC_KEY || ''
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY || ''
const VAPID_EMAIL = process.env.VAPID_EMAIL || 'mailto:admin@example.com'

if (VAPID_PUBLIC && VAPID_PRIVATE) {
  webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC, VAPID_PRIVATE)
} else {
  console.warn('VAPID keys not set. Push notifications will not work until VAPID keys are configured.')
}

type PushSubscriptionJSON = any

const scheduled: Map<string, NodeJS.Timeout> = new Map()

export async function saveSubscription(sub: PushSubscriptionJSON) {
  try {
    const db = getDb()
    await db.collection('pushSubscriptions').updateOne({ endpoint: sub.endpoint }, { $set: sub }, { upsert: true })
    return true
  } catch (e) {
    console.error('Failed to save subscription', e)
    return false
  }
}

export async function getSubscriptions() {
  const db = getDb()
  return db.collection('pushSubscriptions').find({}).toArray()
}

export async function sendNotification(sub: PushSubscriptionJSON, payload: any) {
  if (!VAPID_PUBLIC || !VAPID_PRIVATE) return
  try {
    await webpush.sendNotification(sub, typeof payload === 'string' ? payload : JSON.stringify(payload))
  } catch (e) {
    console.error('Push send error', e)
  }
}

function computeNextTriggerTime(timeStr: string) {
  const parts = timeStr.split(':')
  if (parts.length < 2) return null
  const hour = Number(parts[0])
  const minute = Number(parts[1])
  if (Number.isNaN(hour) || Number.isNaN(minute)) return null
  const now = new Date()
  const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0)
  if (target.getTime() <= now.getTime()) target.setDate(target.getDate() + 1)
  return target
}

export async function scheduleNotificationForMedication(med: any) {
  try {
    if (!med || !med._id || !med.time) return
    const target = computeNextTriggerTime(med.time)
    if (!target) return
    const delay = target.getTime() - Date.now()
    // clear existing
    cancelScheduledNotification(String(med._id))
    const timeout = setTimeout(async () => {
      try {
        const subs = await getSubscriptions()
        const payload = {
          title: `Medication: ${med.name}`,
          body: `${med.dose} — Time to take your medication.`,
          data: { medId: med._id }
        }
        for (const s of subs) {
          await sendNotification(s, payload)
        }
      } catch (e) {
        console.error('Scheduled push error', e)
      }
      // After firing, schedule next day's notification
      scheduleNotificationForMedication(med)
    }, delay)
    scheduled.set(String(med._id), timeout)
    console.log(`Scheduled notification for med ${med._id} at ${target.toISOString()}`)
  } catch (e) {
    console.error('Failed to schedule notification', e)
  }
}

export function cancelScheduledNotification(medId: string) {
  const t = scheduled.get(medId)
  if (t) {
    clearTimeout(t)
    scheduled.delete(medId)
  }
}

export async function rescheduleAll() {
  try {
    const db = getDb()
    const meds = await db.collection('medications').find({}).toArray()
    for (const m of meds) {
      scheduleNotificationForMedication(m)
    }
  } catch (e) {
    console.error('Failed to reschedule notifications on startup', e)
  }
}

export { VAPID_PUBLIC }
