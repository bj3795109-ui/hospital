"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CareCompanionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (data: { companionType: string; duration: string; notes: string }) => Promise<void>
}

export function CareCompanionModal({ open, onOpenChange, onAdd }: CareCompanionModalProps) {
  const [companionType, setCompanionType] = useState("")
  const [duration, setDuration] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!companionType || !duration) {
      alert("Please select companion type and duration")
      return
    }
    setLoading(true)
    try {
      await onAdd({ companionType, duration, notes })
      setCompanionType("")
      setDuration("")
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
          <DialogTitle>Care Companion</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="cc-type">Companion Type</Label>
            <Select value={companionType} onValueChange={setCompanionType}>
              <SelectTrigger id="cc-type">
                <SelectValue placeholder="Select companion type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="physical-therapy">Physical Therapy</SelectItem>
                <SelectItem value="mental-health">Mental Health Support</SelectItem>
                <SelectItem value="nutrition">Nutrition Counseling</SelectItem>
                <SelectItem value="general">General Care</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="cc-duration">Duration</Label>
            <Input
              id="cc-duration"
              placeholder="e.g., 30 minutes, 1 hour"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="cc-notes">Notes</Label>
            <Textarea
              id="cc-notes"
              placeholder="Any additional details..."
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
            {loading ? "Adding..." : "Add Care Companion"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
