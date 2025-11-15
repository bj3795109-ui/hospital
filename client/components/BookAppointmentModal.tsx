"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface BookAppointmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (data: { doctorName: string; date: string; time: string; reason: string }) => Promise<void>
}

export function BookAppointmentModal({ open, onOpenChange, onAdd }: BookAppointmentModalProps) {
  const [doctorName, setDoctorName] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!doctorName || !date || !time) {
      alert("Please fill in all required fields")
      return
    }
    setLoading(true)
    try {
      await onAdd({ doctorName, date, time, reason })
      setDoctorName("")
      setDate("")
      setTime("")
      setReason("")
      onOpenChange(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book Appointment</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="apt-doctor">Doctor Name</Label>
            <Input
              id="apt-doctor"
              placeholder="e.g., Dr. Patel"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="apt-date">Date</Label>
            <Input
              id="apt-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="apt-time">Time</Label>
            <Input
              id="apt-time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="apt-reason">Reason</Label>
            <Textarea
              id="apt-reason"
              placeholder="e.g., Follow-up checkup"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Booking..." : "Book Appointment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
