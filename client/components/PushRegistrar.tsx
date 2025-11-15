"use client"

import { useEffect } from 'react'
import api from '@/lib/axios'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export default function PushRegistrar() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return

    let reg: ServiceWorkerRegistration | null = null

    async function register() {
      try {
        reg = await navigator.serviceWorker.register('/service-worker.js')
        // fetch VAPID key
        const res = await api.get('/push/vapid')
        const publicKey = res.data?.publicKey
        if (!publicKey) return

        const existingSub = await reg.pushManager.getSubscription()
        if (existingSub) {
          // ensure server has it
          await api.post('/push/subscribe', existingSub)
          return
        }

        const applicationServerKey = urlBase64ToUint8Array(publicKey)
        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey,
        })
        await api.post('/push/subscribe', sub)
      } catch (e) {
        console.warn('Push registration failed', e)
      }
    }

    register()
  }, [])

  return null
}
