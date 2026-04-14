'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginForm() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (!res.ok) {
        setError('Mật khẩu không đúng!')
      } else {
        router.push('/admin')
        router.refresh()
      }
    } catch {
      setError('Lỗi kết nối. Vui lòng thử lại!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Mật khẩu admin</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Nhập mật khẩu..."
          className="input-field"
          autoFocus
        />
      </div>
      {error && (
        <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>
      )}
      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
      </button>
    </form>
  )
}
