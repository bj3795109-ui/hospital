"use client"

import React, { useState } from 'react'
import api from '@/lib/axios'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { email, password })
      if (res.data?.token) {
        localStorage.setItem('token', res.data.token)
        // optional: store user
        localStorage.setItem('user', JSON.stringify(res.data.user || {}))
        router.push('/')
      } else {
        alert('Login failed')
      }
    } catch (err) {
      alert('Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-xl p-6 shadow">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Sign in</h2>
        <label className="block mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">Email</span>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-1 p-2 border rounded bg-transparent" />
        </label>
        <label className="block mb-4">
          <span className="text-sm text-gray-600 dark:text-gray-300">Password</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-1 p-2 border rounded bg-transparent" />
        </label>
        <div className="flex items-center justify-between">
          <button type="submit" className="bg-black text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
        </div>
      </form>
    </div>
  )
}
