"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface ScanPrescriptionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (data: { prescriptionName: string; doctorName: string; notes: string }) => Promise<void>
}

export function ScanPrescriptionModal({ open, onOpenChange, onAdd }: ScanPrescriptionModalProps) {
  const [prescriptionName, setPrescriptionName] = useState("")
  const [doctorName, setDoctorName] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!prescriptionName || !doctorName) {
      alert("Please fill in prescription name and doctor name")
      return
    }
    setLoading(true)
    try {
      await onAdd({ prescriptionName, doctorName, notes })
      setPrescriptionName("")
      setDoctorName("")
      setNotes("")
      onOpenChange(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Scan Prescription</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="rx-name">Prescription Name</Label>
            <Input
              id="rx-name"
              placeholder="e.g., Antibiotic Course"
              value={prescriptionName}
              onChange={(e) => setPrescriptionName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="rx-doctor">Doctor Name</Label>
            <Input
              id="rx-doctor"
              placeholder="e.g., Dr. Patel"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="rx-notes">Notes</Label>
            <Textarea
              id="rx-notes"
              placeholder="Any additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Scanning..." : "Scan Prescription"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
