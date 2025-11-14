"use client"

import React, { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function Home() {
  const [meds, setMeds] = useState([
    { id: 1, name: "Amoxicillin", dose: "500mg", time: "8:00 AM", taken: true },
    { id: 2, name: "Ibuprofen", dose: "400mg", time: "12:00 PM", taken: true },
    { id: 3, name: "Vitamin D3", dose: "1000 IU", time: "2:00 PM", taken: false },
    { id: 4, name: "Amoxicillin", dose: "500mg", time: "8:00 PM", taken: false },
  ])

  function toggleTaken(id: number) {
    setMeds((prev) => prev.map((m) => (m.id === id ? { ...m, taken: !m.taken } : m)))
  }

  const appointments = [
    { id: 1, title: "Dr. Patel - Follow up", time: "Tomorrow • 10:00 AM" },
    { id: 2, title: "Dentist - Cleaning", time: "Fri • 2:00 PM" },
  ]

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
            <div className="flex gap-3">
              <Button variant="default">Scan Prescription</Button>
              <Button variant="outline">Book Appointment</Button>
              <Button variant="ghost">Care Companion</Button>
            </div>
          </CardContent>
        </Card>

        {/* Today's Medications */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Medications</CardTitle>
            <CardDescription>{meds.length} doses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {meds.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between rounded-lg border px-4 py-3 bg-green-50"
              >
                <div>
                  <div className="font-medium">{m.name}</div>
                  <div className="text-sm text-muted-foreground">{m.dose} • {m.time}</div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant={m.taken ? "secondary" : "outline"}
                    onClick={() => toggleTaken(m.id)}
                  >
                    {m.taken ? "Taken" : "Mark Taken"}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Today's Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Appointments</CardTitle>
            <CardDescription>Upcoming bookings and reminders</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {appointments.map((a) => (
                <li key={a.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{a.title}</div>
                    <div className="text-sm text-muted-foreground">{a.time}</div>
                  </div>
                  <Badge className="bg-slate-100 text-slate-800">Upcoming</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
