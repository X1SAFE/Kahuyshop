'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/hooks/useCart'

interface Props {
  product: Product
}

export default function ProductDetailClient({ product }: Props) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) return
    addItem({
      productId: product.id,
      productName: product.name,
      price: product.price,
      image: product.images[0] ?? '',
      size: selectedSize,
      color: selectedColor,
      quantity,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-primary-500">Trang chủ</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-primary-500">Sản phẩm</Link>
        <span>/</span>
        <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-primary-500">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-gray-800 font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Images */}
        <div>
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-50 mb-3">
            <Image
              src={product.images[selectedImage] ?? 'https://picsum.photos/seed/default/600/800'}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-16 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === idx ? 'border-primary-500' : 'border-gray-200'
                  }`}
                >
                  <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-5">
          <div>
            <span className="bg-primary-100 text-primary-600 text-xs font-semibold px-3 py-1 rounded-full">
              {product.category}
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 mt-2 leading-tight">
              {product.name}
            </h1>
            <div className="text-2xl font-black text-primary-500 mt-2">
              {formatPrice(product.price)}
            </div>
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 text-sm">
            {product.stock > 0 ? (
              <>
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-green-600 font-medium">Còn hàng ({product.stock} sản phẩm)</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 bg-red-500 rounded-full" />
                <span className="text-red-600 font-medium">Hết hàng</span>
              </>
            )}
          </div>

          {/* Size selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-700">Kích cỡ</span>
              {!selectedSize && <span className="text-xs text-red-500">* Vui lòng chọn size</span>}
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-lg border-2 font-medium text-sm transition-colors ${
                    selectedSize === size
                      ? 'border-primary-500 bg-primary-500 text-white'
                      : 'border-gray-200 text-gray-700 hover:border-primary-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-700">
                Màu sắc {selectedColor && <span className="text-primary-500">— {selectedColor}</span>}
              </span>
              {!selectedColor && <span className="text-xs text-red-500">* Vui lòng chọn màu</span>}
            </div>
            <div className="flex flex-wrap gap-2">
              {product.colors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-3 py-2 rounded-lg border-2 text-sm transition-colors ${
                    selectedColor === color
                      ? 'border-primary-500 bg-primary-50 text-primary-600 font-semibold'
                      : 'border-gray-200 text-gray-600 hover:border-primary-300'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <span className="font-semibold text-gray-700 block mb-2">Số lượng</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors text-lg font-bold"
              >
                −
              </button>
              <span className="w-12 text-center font-bold text-lg">{quantity}</span>
              <button
                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors text-lg font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to cart */}
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize || !selectedColor || product.stock === 0}
              className={`flex-1 py-3.5 rounded-xl font-bold text-base transition-all ${
                added
                  ? 'bg-green-500 text-white'
                  : 'bg-primary-500 hover:bg-primary-600 text-white disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed'
              }`}
            >
              {added ? '✓ Đã thêm vào giỏ!' : '🛒 Thêm vào giỏ hàng'}
            </button>
            <Link
              href="/cart"
              className="px-4 py-3.5 rounded-xl border-2 border-primary-500 text-primary-500 font-bold hover:bg-primary-50 transition-colors"
            >
              Xem giỏ
            </Link>
          </div>

          {/* Description */}
          <div className="border-t pt-5">
            <h3 className="font-bold text-gray-800 mb-2">Mô tả sản phẩm</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
          </div>

          {/* Shipping info */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <span>🚚</span> Giao hàng toàn quốc trong 2–5 ngày làm việc
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <span>🔄</span> Đổi trả miễn phí trong 7 ngày
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <span>💳</span> Thanh toán COD, chuyển khoản, MoMo
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
