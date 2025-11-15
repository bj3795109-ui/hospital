"use client"

import React, { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import api from "@/lib/axios"
import { Badge } from "@/components/ui/badge"
import { AddMedicationModal } from "@/components/AddMedicationModal"
import { ScanPrescriptionModal } from "@/components/ScanPrescriptionModal"
import { BookAppointmentModal } from "@/components/BookAppointmentModal"
import { CareCompanionModal } from "@/components/CareCompanionModal"
import { Plus, Trash2 } from "lucide-react"

interface Medication {
  _id?: string
  id?: number
  name: string
  dose: string
  time: string
  taken: boolean
}

interface Action {
  _id: string
  type: string
  details: Record<string, any>
  createdAt: string
}

export default function Home() {
  const [meds, setMeds] = useState<Medication[]>([])
  const [actions, setActions] = useState<Action[]>([])
  const [medModalOpen, setMedModalOpen] = useState(false)
  const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false)
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false)
  const [companionModalOpen, setCompanionModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  // Fetch medications and actions from DB on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const [medsRes, actionsRes] = await Promise.all([
          api.get('/medications'),
          api.get('/actions'),
        ])
        setMeds(medsRes.data)
        setActions(actionsRes.data)
      } catch (err) {
        console.error('Failed to fetch data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  function toggleTaken(id: string | number | undefined) {
    if (!id) return
    setMeds((prev) =>
      prev.map((m) => {
        const mId = m._id || m.id
        return mId === id ? { ...m, taken: !m.taken } : m
      })
    )
    // Call API to update
    api.patch(`/medications/${id}`, { taken: !meds.find((m) => (m._id || m.id) === id)?.taken })
  }

  async function handleAddMedication(data: { name: string; dose: string; time: string }) {
    try {
      const response = await api.post('/medications', data)
      setMeds([...meds, response.data])
    } catch (err) {
      alert('Failed to add medication')
    }
  }

  async function handleAddPrescription(data: { prescriptionName: string; doctorName: string; notes: string }) {
    try {
      const response = await api.post('/actions/scan-prescription', data)
      setActions([response.data, ...actions])
    } catch (err) {
      alert('Failed to scan prescription')
    }
  }

  async function handleAddAppointment(data: { doctorName: string; date: string; time: string; reason: string }) {
    try {
      const response = await api.post('/actions/book-appointment', data)
      setActions([response.data, ...actions])
    } catch (err) {
      alert('Failed to book appointment')
    }
  }

  async function handleAddCompanion(data: { companionType: string; duration: string; notes: string }) {
    try {
      const response = await api.post('/actions/care-companion', data)
      setActions([response.data, ...actions])
    } catch (err) {
      alert('Failed to add care companion')
    }
  }

  async function deleteAction(id: string) {
    try {
      await api.delete(`/actions/${id}`)
      setActions(actions.filter((a) => a._id !== id))
    } catch (err) {
      alert('Failed to delete action')
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top header cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <CardHeader>
              <CardTitle>Reward Points</CardTitle>
              <CardDescription>450</CardDescription>
            </CardHeader>
          </Card>

          <Card className="p-4">
            <CardHeader>
              <CardTitle>Compliance Rate</CardTitle>
              <CardDescription>100%</CardDescription>
            </CardHeader>
          </Card>

          <Card className="p-4">
            <CardHeader>
              <CardTitle>Active Medications</CardTitle>
              <CardDescription>4</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 flex-wrap">
              <Button variant="default" onClick={() => setPrescriptionModalOpen(true)}>Scan Prescription</Button>
              <Button variant="outline" onClick={() => setAppointmentModalOpen(true)}>Book Appointment</Button>
              <Button variant="ghost" onClick={() => setCompanionModalOpen(true)}>Care Companion</Button>
            </div>
          </CardContent>
        </Card>

        {/* Actions History */}
        {actions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Actions</CardTitle>
              <CardDescription>{actions.length} actions recorded</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {actions.map((action) => (
                <div
                  key={action._id}
                  className="flex items-center justify-between rounded-lg border px-4 py-3 bg-blue-50"
                >
                  <div className="flex-1">
                    <div className="font-medium capitalize">
                      {action.type.replace('-', ' ')}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {Object.entries(action.details)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(' • ')}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(action.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteAction(action._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Today's Medications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Today's Medications</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setMedModalOpen(true)}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </CardTitle>
            <CardDescription>
              {loading ? "Loading..." : meds.length > 0 ? `${meds.length} doses` : "No medications added"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="text-center text-muted-foreground py-8">Loading medications...</div>
            ) : meds.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Plus className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No medications yet. Click the + icon to add one.</p>
              </div>
            ) : (
              meds.map((m) => (
                <div
                  key={m._id || m.id}
                  className="flex items-center justify-between rounded-lg border px-4 py-3 bg-green-50"
                >
                  <div>
                    <div className="font-medium">{m.name}</div>
                    <div className="text-sm text-muted-foreground">{m.dose} • {m.time}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant={m.taken ? "secondary" : "outline"}
                      onClick={() => toggleTaken(m._id || m.id)}
                    >
                      {m.taken ? "Taken" : "Mark Taken"}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Add Medication Modal */}
        <AddMedicationModal open={medModalOpen} onOpenChange={setMedModalOpen} onAdd={handleAddMedication} />

        {/* Today's Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Appointments</CardTitle>
            <CardDescription>Upcoming bookings and reminders</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="text-center text-muted-foreground py-4">No appointments yet</li>
            </ul>
          </CardContent>
        </Card>

        {/* Modals */}
        <ScanPrescriptionModal open={prescriptionModalOpen} onOpenChange={setPrescriptionModalOpen} onAdd={handleAddPrescription} />
        <BookAppointmentModal open={appointmentModalOpen} onOpenChange={setAppointmentModalOpen} onAdd={handleAddAppointment} />
        <CareCompanionModal open={companionModalOpen} onOpenChange={setCompanionModalOpen} onAdd={handleAddCompanion} />
      </div>
    </div>
  )
}
