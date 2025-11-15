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

  async function handleSubmit() {
    if (!name || !dose || !time) {
      alert("Please fill in all fields")
      return
    }
    setLoading(true)
    try {
      await onAdd({ name, dose, time })
      setName("")
      setDose("")
      setTime("")
      onOpenChange(false)
    } finally {
      setLoading(false)
    }
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
