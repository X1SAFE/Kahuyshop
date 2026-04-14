'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Props {
  productId: string
}

export default function AdminProductActions({ productId }: Props) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return
    setDeleting(true)
    await fetch(`/api/products/${productId}`, { method: 'DELETE' })
    router.refresh()
    setDeleting(false)
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Link
        href={`/admin/products/${productId}`}
        className="text-xs px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
      >
        Sửa
      </Link>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="text-xs px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors font-medium disabled:opacity-50"
      >
        {deleting ? '...' : 'Xóa'}
      </button>
    </div>
  )
}
