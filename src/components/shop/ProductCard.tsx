'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const image = product.images[0] ?? 'https://picsum.photos/seed/default/600/800'

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="card hover:shadow-md transition-shadow duration-200">
        {/* Image */}
        <div className="relative overflow-hidden bg-gray-50 aspect-[3/4]">
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white text-gray-700 text-sm font-semibold px-3 py-1 rounded-full">
                Hết hàng
              </span>
            </div>
          )}
          {/* Category badge */}
          <div className="absolute top-2 left-2">
            <span className="bg-primary-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
              {product.category}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1 group-hover:text-primary-500 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-primary-500 font-bold text-sm">
              {formatPrice(product.price)}
            </span>
            <div className="flex gap-1">
              {product.colors.slice(0, 3).map((color) => (
                <div
                  key={color}
                  className="w-3 h-3 rounded-full border border-gray-200"
                  title={color}
                  style={{ backgroundColor: colorToHex(color) }}
                />
              ))}
              {product.colors.length > 3 && (
                <span className="text-xs text-gray-400">+{product.colors.length - 3}</span>
              )}
            </div>
          </div>
          <div className="flex gap-1 mt-2 flex-wrap">
            {product.sizes.slice(0, 4).map(size => (
              <span key={size} className="text-xs text-gray-500 border border-gray-200 px-1.5 py-0.5 rounded">
                {size}
              </span>
            ))}
            {product.sizes.length > 4 && (
              <span className="text-xs text-gray-400">+{product.sizes.length - 4}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

function colorToHex(colorName: string): string {
  const map: Record<string, string> = {
    'Trắng': '#ffffff',
    'Đen': '#1a1a1a',
    'Xám': '#808080',
    'Hồng': '#ff69b4',
    'Đỏ': '#e53935',
    'Xanh': '#1976d2',
    'Vàng': '#fdd835',
    'Be': '#f5deb3',
    'Nâu': '#795548',
    'Xanh rêu': '#558b2f',
    'Tím': '#9c27b0',
  }
  for (const [key, hex] of Object.entries(map)) {
    if (colorName.toLowerCase().includes(key.toLowerCase())) return hex
  }
  return '#e0e0e0'
}
