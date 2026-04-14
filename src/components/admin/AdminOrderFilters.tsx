'use client'

import Link from 'next/link'

interface Props {
  counts: Record<string, number>
  activeStatus?: string
}

const STATUS_OPTIONS = [
  { value: '', label: 'Tất cả', color: 'bg-gray-100 text-gray-700' },
  { value: 'pending', label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'processing', label: 'Đang xử lý', color: 'bg-blue-100 text-blue-700' },
  { value: 'shipped', label: 'Đang giao', color: 'bg-purple-100 text-purple-700' },
  { value: 'delivered', label: 'Đã giao', color: 'bg-green-100 text-green-700' },
  { value: 'cancelled', label: 'Đã hủy', color: 'bg-red-100 text-red-700' },
]

export default function AdminOrderFilters({ counts, activeStatus }: Props) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {STATUS_OPTIONS.map(opt => {
        const isActive = activeStatus === opt.value || (!activeStatus && !opt.value)
        const count = opt.value ? counts[opt.value] || 0 : Object.values(counts).reduce((a, b) => a + b, 0)
        return (
          <Link
            key={opt.value}
            href={opt.value ? `/admin/orders?status=${opt.value}` : '/admin/orders'}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
              isActive ? opt.color : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            {opt.label}
            <span className="text-xs opacity-70">({count})</span>
          </Link>
        )
      })}
    </div>
  )
}
