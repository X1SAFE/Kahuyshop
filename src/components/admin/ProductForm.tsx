'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CATEGORIES = ['Áo', 'Quần', 'Váy', 'Phụ kiện']
const DEFAULT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '26', '27', '28', '29', '30', '31', '32', '34', 'One Size']
const DEFAULT_COLORS = ['Trắng', 'Đen', 'Xám', 'Hồng', 'Đỏ', 'Xanh', 'Vàng', 'Be', 'Nâu', 'Xanh rêu', 'Tím', 'Cam']

interface ProductFormProps {
  product?: {
    id: string
    name: string
    description: string
    price: number
    images: string
    category: string
    sizes: string
    colors: string
    stock: number
  }
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter()
  const isEdit = !!product

  const parseArr = (str: string) => {
    try { return JSON.parse(str) } catch { return [] }
  }

  const [form, setForm] = useState({
    name: product?.name ?? '',
    description: product?.description ?? '',
    price: product?.price?.toString() ?? '',
    category: product?.category ?? 'Áo',
    stock: product?.stock?.toString() ?? '0',
  })
  const [images, setImages] = useState<string[]>(
    product ? parseArr(product.images) : ['']
  )
  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    product ? parseArr(product.sizes) : []
  )
  const [selectedColors, setSelectedColors] = useState<string[]>(
    product ? parseArr(product.colors) : []
  )
  const [customSize, setCustomSize] = useState('')
  const [customColor, setCustomColor] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    )
  }

  const toggleColor = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.name || !form.price || selectedSizes.length === 0 || selectedColors.length === 0) {
      setError('Vui lòng điền đầy đủ thông tin, chọn ít nhất 1 size và 1 màu')
      return
    }

    setLoading(true)
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        images: images.filter(Boolean),
        category: form.category,
        sizes: selectedSizes,
        colors: selectedColors,
        stock: parseInt(form.stock) || 0,
      }

      const url = isEdit ? `/api/products/${product!.id}` : '/api/products'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Failed')
      router.push('/admin/products')
      router.refresh()
    } catch {
      setError('Đã có lỗi xảy ra. Vui lòng thử lại!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Tên sản phẩm *</label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="VD: Áo Thun Basic Oversize"
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Giá (₫) *</label>
          <input
            type="number"
            value={form.price}
            onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
            placeholder="150000"
            min="0"
            step="1000"
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Danh mục *</label>
          <select
            value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            className="input-field"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Số lượng kho</label>
          <input
            type="number"
            value={form.stock}
            onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
            min="0"
            className="input-field"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Mô tả</label>
          <textarea
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            rows={4}
            placeholder="Mô tả chi tiết về sản phẩm..."
            className="input-field resize-none"
          />
        </div>
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Ảnh sản phẩm (URL)
        </label>
        <div className="space-y-2">
          {images.map((img, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="url"
                value={img}
                onChange={e => {
                  const newImages = [...images]
                  newImages[idx] = e.target.value
                  setImages(newImages)
                }}
                placeholder="https://example.com/image.jpg"
                className="input-field"
              />
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={() => setImages(images.filter((_, i) => i !== idx))}
                  className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          {images.length < 5 && (
            <button
              type="button"
              onClick={() => setImages([...images, ''])}
              className="text-sm text-primary-500 hover:text-primary-600 font-medium"
            >
              + Thêm ảnh
            </button>
          )}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Kích cỡ * <span className="font-normal text-gray-400">({selectedSizes.length} đã chọn)</span>
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {DEFAULT_SIZES.map(size => (
            <button
              key={size}
              type="button"
              onClick={() => toggleSize(size)}
              className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                selectedSizes.includes(size)
                  ? 'bg-primary-500 text-white border-primary-500 font-semibold'
                  : 'border-gray-200 text-gray-600 hover:border-primary-300'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={customSize}
            onChange={e => setCustomSize(e.target.value)}
            placeholder="Size khác..."
            className="input-field flex-1"
          />
          <button
            type="button"
            onClick={() => {
              if (customSize.trim()) {
                toggleSize(customSize.trim())
                setCustomSize('')
              }
            }}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
          >
            Thêm
          </button>
        </div>
      </div>

      {/* Colors */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Màu sắc * <span className="font-normal text-gray-400">({selectedColors.length} đã chọn)</span>
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {DEFAULT_COLORS.map(color => (
            <button
              key={color}
              type="button"
              onClick={() => toggleColor(color)}
              className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                selectedColors.includes(color)
                  ? 'bg-primary-500 text-white border-primary-500 font-semibold'
                  : 'border-gray-200 text-gray-600 hover:border-primary-300'
              }`}
            >
              {color}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={customColor}
            onChange={e => setCustomColor(e.target.value)}
            placeholder="Màu khác..."
            className="input-field flex-1"
          />
          <button
            type="button"
            onClick={() => {
              if (customColor.trim()) {
                toggleColor(customColor.trim())
                setCustomColor('')
              }
            }}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
          >
            Thêm
          </button>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Đang lưu...' : isEdit ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-secondary"
        >
          Hủy
        </button>
      </div>
    </form>
  )
}
