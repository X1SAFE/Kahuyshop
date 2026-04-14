'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/hooks/useCart'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const { items, total, updateQuantity, removeItem, count } = useCart()

  if (count === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-8xl mb-6">🛒</div>
        <h1 className="text-2xl font-black text-gray-900 mb-3">Giỏ hàng trống</h1>
        <p className="text-gray-500 mb-8">Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
        <Link href="/products" className="btn-primary">
          Mua Sắm Ngay →
        </Link>
      </div>
    )
  }

  const shippingFee = total >= 500000 ? 0 : 35000
  const finalTotal = total + shippingFee

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-6">
        Giỏ Hàng ({count} sản phẩm)
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, idx) => (
            <div key={`${item.productId}-${item.size}-${item.color}`} className="card p-4">
              <div className="flex gap-4">
                {/* Image */}
                <Link href={`/products/${item.productId}`} className="relative w-20 h-24 sm:w-24 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50">
                  <Image
                    src={item.image || 'https://picsum.photos/seed/default/200/266'}
                    alt={item.productName}
                    fill
                    className="object-cover"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-2">
                    <Link href={`/products/${item.productId}`} className="font-semibold text-gray-800 hover:text-primary-500 transition-colors line-clamp-2 text-sm sm:text-base">
                      {item.productName}
                    </Link>
                    <button
                      onClick={() => removeItem(item.productId, item.size, item.color)}
                      className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                      aria-label="Xóa"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="text-sm text-gray-500 mt-1">
                    Size: <span className="font-medium text-gray-700">{item.size}</span>
                    {' '} · Màu: <span className="font-medium text-gray-700">{item.color}</span>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors font-bold text-gray-600"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors font-bold text-gray-600"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-bold text-primary-500">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card p-5 sticky top-24">
            <h2 className="font-black text-gray-900 text-lg mb-4">Tóm tắt đơn hàng</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính ({count} sản phẩm)</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí giao hàng</span>
                <span className={shippingFee === 0 ? 'text-green-600 font-medium' : ''}>
                  {shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}
                </span>
              </div>
              {shippingFee > 0 && (
                <p className="text-xs text-gray-400">
                  Mua thêm {formatPrice(500000 - total)} để được miễn phí ship
                </p>
              )}
              <div className="border-t pt-3 flex justify-between font-bold text-base">
                <span>Tổng cộng</span>
                <span className="text-primary-500 text-lg">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            <Link href="/checkout" className="btn-primary w-full text-center block mt-5 text-base">
              Tiến hành thanh toán →
            </Link>

            <Link href="/products" className="text-center block mt-3 text-sm text-gray-500 hover:text-primary-500 transition-colors">
              ← Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
