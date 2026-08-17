'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const supabase = createClient()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Sila isi e-mel dan kata laluan.')
      return
    }
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error('E-mel atau kata laluan tidak sah.')
        } else {
          toast.error(error.message)
        }
      } else {
        toast.success('Log masuk berjaya!')
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err) {
      toast.error('Ralat tidak dijangka.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-white text-2xl font-bold">SK</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">SK RC KUBONG</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Log masuk untuk guru & pentadbir</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">E-mel</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              placeholder="guru@sekolah.edu.my"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kata Laluan</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg disabled:opacity-50"
          >
            {loading ? 'Sedang log masuk...' : 'Log Masuk'}
          </button>
        </form>
      </div>
    </div>
  )
}
