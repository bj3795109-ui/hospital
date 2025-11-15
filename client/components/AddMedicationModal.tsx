"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AddMedicationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (data: { name: string; dose: string; time: string }) => Promise<void>
}

export function AddMedicationModal({ open, onOpenChange, onAdd }: AddMedicationModalProps) {
  const [name, setName] = useState("")
  const [dose, setDose] = useState("")
  const [time, setTime] = useState("")
  const [loading, setLoading] = useState(false)
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  )

  async function handleSubmit() {
    if (!name || !dose || !time) {
      alert("Please fill in all fields")
      return
    }
    setLoading(true)
    // Request notification permission before adding
    try {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        const p = await Notification.requestPermission()
        setNotifPermission(p)
      }
    } catch (e) {
      console.warn('Notification permission request failed', e)
    }
    try {
      await onAdd({ name, dose, time })
      // schedule notification (best-effort) for the chosen time
      try {
        if (typeof window !== 'undefined' && (notifPermission === 'granted' || Notification.permission === 'granted')) {
          scheduleMedicationNotification(name, dose, time)
        }
      } catch (e) {
        console.warn('Scheduling notification failed', e)
      }
      setName("")
      setDose("")
      setTime("")
      onOpenChange(false)
    } finally {
      setLoading(false)
    }
  }

  function scheduleMedicationNotification(name: string, dose: string, timeStr: string) {
    // timeStr expected in "HH:MM" (24-hour) from <input type=time>
    const parts = timeStr.split(':')
    if (parts.length < 2) return
    const hour = Number(parts[0])
    const minute = Number(parts[1])
    if (Number.isNaN(hour) || Number.isNaN(minute)) return

    const now = new Date()
    const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0)
    if (target.getTime() <= now.getTime()) {
      // if time already passed today, schedule for tomorrow
      target.setDate(target.getDate() + 1)
    }

    const delay = target.getTime() - now.getTime()

    // Use setTimeout to show the notification while the page is open (best-effort).
    // If a service worker is registered, attempt to use it as a fallback to showNotification.
    setTimeout(async () => {
      const title = `Medication: ${name}`
      const body = `${dose} • Time to take your medication.`
      try {
        // Try service worker registration showNotification if available
        if ('serviceWorker' in navigator) {
          const reg = await navigator.serviceWorker.getRegistration()
          if (reg && reg.showNotification) {
            reg.showNotification(title, { body })
            return
          }
        }

        // Fallback to the Notification constructor
        // Note: This will only work if the page is open and permission is granted.
        // Many browsers require an active context for new Notification.
        // eslint-disable-next-line no-new
        new Notification(title, { body })
      } catch (e) {
        console.warn('Failed to show medication notification', e)
      }
    }, delay)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Medication</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="med-name">Medication Name</Label>
            <Input
              id="med-name"
              placeholder="e.g., Amoxicillin"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="med-dose">Dose</Label>
            <Input
              id="med-dose"
              placeholder="e.g., 500mg"
              value={dose}
              onChange={(e) => setDose(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="med-time">Time</Label>
            <Input
              id="med-time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Adding..." : "Add Medication"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
