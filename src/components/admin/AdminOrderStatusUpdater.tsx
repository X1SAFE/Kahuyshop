'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { statusLabel } from '@/lib/utils'

const STATUS_FLOW = [
  { value: 'pending', label: 'Chờ xác nhận', color: 'bg-yellow-500', next: 'processing' },
  { value: 'processing', label: 'Đang xử lý', color: 'bg-blue-500', next: 'shipped' },
  { value: 'shipped', label: 'Đang giao', color: 'bg-purple-500', next: 'delivered' },
  { value: 'delivered', label: 'Đã giao', color: 'bg-green-500', next: null },
  { value: 'cancelled', label: 'Đã hủy', color: 'bg-red-500', next: null },
]

interface Props {
  orderId: string
  currentStatus: string
}

export default function AdminOrderStatusUpdater({ orderId, currentStatus }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(currentStatus)

  const updateStatus = async (newStatus: string) => {
    if (!confirm(`Xác nhận chuyển trạng thái thành "${statusLabel(newStatus)}"?`)) return
    setLoading(true)
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error('Failed')
      setStatus(newStatus)
      router.refresh()
    } catch {
      alert('Cập nhật thất bại. Vui lòng thử lại!')
    } finally {
      setLoading(false)
    }
  }

  const currentIndex = STATUS_FLOW.findIndex(s => s.value === status)
  const currentStep = STATUS_FLOW.find(s => s.value === status)

  return (
    <div className="card p-5">
      <h2 className="font-black text-gray-900 mb-4">Cập Nhật Trạng Thái</h2>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-2">
        {STATUS_FLOW.slice(0, 4).map((step, idx) => {
          const isActive = idx <= currentIndex
          const isCurrent = idx === currentIndex
          return (
            <div key={step.value} className="flex items-center gap-2 flex-shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                isActive ? `${step.color} text-white` : 'bg-gray-200 text-gray-400'
              } ${isCurrent ? 'ring-2 ring-offset-2 ring-primary-500' : ''}`}>
                {idx + 1}
              </div>
              <span className={`text-sm font-medium ${isActive ? 'text-gray-800' : 'text-gray-400'}`}>
                {step.label}
              </span>
              {idx < 3 && (
                <div className={`w-8 h-0.5 mx-1 ${idx < currentIndex ? 'bg-gray-300' : 'bg-gray-200'}`} />
              )}
            </div>
          )
        })}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        {currentStep?.next && (
          <button
            onClick={() => updateStatus(currentStep.next!)}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Đang cập nhật...' : `✓ Xác nhận ${statusLabel(currentStep.next)}`}
          </button>
        )}
        {status === 'pending' && (
          <button
            onClick={() => updateStatus('cancelled')}
            disabled={loading}
            className="px-4 py-2.5 rounded-lg bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-colors"
          >
            ✕ Hủy đơn hàng
          </button>
        )}
        {status === 'cancelled' && (
          <button
            onClick={() => updateStatus('pending')}
            disabled={loading}
            className="px-4 py-2.5 rounded-lg bg-yellow-50 text-yellow-600 font-semibold hover:bg-yellow-100 transition-colors"
          >
            ↺ Khôi phục đơn hàng
          </button>
        )}
      </div>
    </div>
  )
}
