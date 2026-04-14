'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

interface ProductFiltersProps {
  categories: string[]
  sizes: string[]
  activeCategory?: string
  activeSize?: string
  activeColor?: string
}

const COLORS = [
  { name: 'Trắng', hex: '#ffffff' },
  { name: 'Đen', hex: '#1a1a1a' },
  { name: 'Xám', hex: '#808080' },
  { name: 'Hồng', hex: '#ff69b4' },
  { name: 'Đỏ', hex: '#e53935' },
  { name: 'Xanh', hex: '#1976d2' },
  { name: 'Vàng', hex: '#fdd835' },
  { name: 'Be', hex: '#f5deb3' },
]

export default function ProductFilters({
  categories,
  sizes,
  activeCategory,
  activeSize,
  activeColor,
}: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === null || params.get(key) === value) {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.push(`/products?${params.toString()}`)
  }, [router, searchParams])

  const clearAll = () => router.push('/products')

  const hasFilters = activeCategory || activeSize || activeColor

  return (
    <div className="space-y-5">
      {hasFilters && (
        <button
          onClick={clearAll}
          className="w-full text-sm text-primary-500 border border-primary-300 rounded-lg py-2 hover:bg-primary-50 transition-colors"
        >
          ✕ Xóa bộ lọc
        </button>
      )}

      {/* Categories */}
      <div>
        <h3 className="font-bold text-gray-800 mb-2 text-sm uppercase tracking-wide">Danh Mục</h3>
        <div className="space-y-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => updateFilter('category', cat)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                activeCategory === cat
                  ? 'bg-primary-500 text-white font-semibold'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h3 className="font-bold text-gray-800 mb-2 text-sm uppercase tracking-wide">Kích Cỡ</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map(size => (
            <button
              key={size}
              onClick={() => updateFilter('size', size)}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                activeSize === size
                  ? 'bg-primary-500 text-white border-primary-500 font-semibold'
                  : 'border-gray-200 text-gray-600 hover:border-primary-300'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <h3 className="font-bold text-gray-800 mb-2 text-sm uppercase tracking-wide">Màu Sắc</h3>
        <div className="flex flex-wrap gap-2">
          {COLORS.map(color => (
            <button
              key={color.name}
              onClick={() => updateFilter('color', color.name)}
              title={color.name}
              className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${
                activeColor?.toLowerCase() === color.name.toLowerCase()
                  ? 'border-primary-500 scale-110'
                  : 'border-gray-300'
              }`}
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
