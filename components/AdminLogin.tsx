'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [lockedUntil, setLockedUntil] = useState<number | null>(null)
  const router = useRouter()

  const isLocked = lockedUntil !== null && Date.now() < lockedUntil

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isLocked) {
      setError('Too many attempts. Please wait a moment and try again.')
      return
    }

    // Simple authentication (demo). In production use a secure server-side auth.
    if (username === 'admin' && password === 'mammaandmeadmin') {
      // Set a cookie for middleware/client checks
      document.cookie = `adminAuth=1; path=/; max-age=86400; samesite=lax` // add ; secure when served over HTTPS
      router.push('/admin/dashboard')
    } else {
      const nextAttempts = attempts + 1
      setAttempts(nextAttempts)
      if (nextAttempts >= 5) {
        setLockedUntil(Date.now() + 30_000) // 30s lockout
        setAttempts(0)
      }
      setError('Invalid username or password')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-pink to-bg-purple flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 md:p-12 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple to-primary-pink-dark flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            M
          </div>
          <h1 className="text-3xl font-bold text-purple mb-2">Admin Login</h1>
          <p className="text-gray-600">Sign in to access the admin panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
              required
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={isLocked}
            className="w-full bg-primary-pink-dark hover:bg-pink-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            {isLocked ? 'Locked — try again shortly' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-center text-sm text-blue-800 font-semibold mb-2">
            🔐 Admin Credentials
          </p>
          <div className="text-center text-sm text-blue-700 space-y-1">
            <p><strong>Username:</strong> admin</p>
            <p><strong>Password:</strong> mammaandmeadmin</p>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <a
            href="/admin/dashboard"
            className="text-sm text-purple hover:text-purple-light font-semibold underline"
          >
            Or click here to access admin panel directly
          </a>
        </div>
      </div>
    </div>
  )
}

