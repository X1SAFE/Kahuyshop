'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useCart } from '@/hooks/useCart'
import { formatPrice, paymentLabel } from '@/lib/utils'
import { PaymentMethod } from '@/types'

const PAYMENT_METHODS: { id: PaymentMethod; label: string; icon: string; desc: string; disabled?: boolean }[] = [
  { id: 'COD', label: 'Thanh toán khi nhận hàng', icon: '💵', desc: 'Trả tiền mặt khi nhận hàng' },
  { id: 'BANK', label: 'Chuyển khoản ngân hàng', icon: '🏦', desc: 'TPBank - 00001650462 - CHAU HUY' },
  { id: 'MOMO', label: 'Ví MoMo', icon: '📱', desc: 'MoMo - 0337804474' },
  { id: 'VNPAY', label: 'VNPay', icon: '💳', desc: 'Sắp ra mắt', disabled: true },
]

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const router = useRouter()

  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    address: '',
    note: '',
  })
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const shippingFee = total >= 500000 ? 0 : 35000
  const finalTotal = total + shippingFee

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!form.customerName.trim()) newErrors.customerName = 'Vui lòng nhập họ tên'
    if (!form.phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại'
    else if (!/^(0|\+84)[0-9]{8,9}$/.test(form.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ'
    }
    if (!form.address.trim()) newErrors.address = 'Vui lòng nhập địa chỉ nhận hàng'
    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          paymentMethod,
          totalAmount: finalTotal,
          items: items.map(item => ({
            productId: item.productId,
            productName: item.productName,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      })

      if (!res.ok) throw new Error('Order failed')
      const order = await res.json()
      clearCart()
      router.push(`/order-confirmation/${order.id}`)
    } catch (err) {
      alert('Đã có lỗi xảy ra. Vui lòng thử lại!')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="text-7xl mb-4">🛒</div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Giỏ hàng trống</h2>
        <a href="/products" className="btn-primary">Mua sắm ngay</a>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-6">Thanh Toán</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Customer info */}
            <div className="card p-5">
              <h2 className="font-black text-gray-900 text-lg mb-4">Thông Tin Giao Hàng</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Họ tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={form.customerName}
                    onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))}
                    className={`input-field ${errors.customerName ? 'border-red-400' : ''}`}
                  />
                  {errors.customerName && <p className="text-xs text-red-500 mt-1">{errors.customerName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="0337804474"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className={`input-field ${errors.phone ? 'border-red-400' : ''}`}
                  />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Địa chỉ nhận hàng <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                    rows={3}
                    value={form.address}
                    onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                    className={`input-field resize-none ${errors.address ? 'border-red-400' : ''}`}
                  />
                  {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Ghi chú <span className="text-gray-400 font-normal">(không bắt buộc)</span>
                  </label>
                  <textarea
                    placeholder="Giao giờ hành chính, để ở bảo vệ,..."
                    rows={2}
                    value={form.note}
                    onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                    className="input-field resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div className="card p-5">
              <h2 className="font-black text-gray-900 text-lg mb-4">Hình Thức Thanh Toán</h2>
              <div className="space-y-3">
                {PAYMENT_METHODS.map(method => (
                  <label
                    key={method.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${
                      method.disabled
                        ? 'opacity-50 cursor-not-allowed border-gray-100 bg-gray-50'
                        : paymentMethod === method.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={() => !method.disabled && setPaymentMethod(method.id)}
                      disabled={method.disabled}
                      className="mt-0.5 accent-pink-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{method.icon}</span>
                        <span className="font-semibold text-gray-800 text-sm">{method.label}</span>
                        {method.disabled && (
                          <span className="bg-orange-100 text-orange-600 text-xs px-2 py-0.5 rounded-full font-medium">
                            Sắp ra mắt
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 ml-7">{method.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              {/* Bank QR */}
              {paymentMethod === 'BANK' && (
                <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <h3 className="font-bold text-blue-800 mb-3">Chi tiết chuyển khoản</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ngân hàng:</span>
                        <span className="font-bold text-gray-800">TPBank</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Số tài khoản:</span>
                        <span className="font-bold text-gray-800 font-mono">00001650462</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tên chủ TK:</span>
                        <span className="font-bold text-gray-800">CHAU HUY</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Số tiền:</span>
                        <span className="font-bold text-primary-500">{formatPrice(finalTotal)}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        Nội dung: KAHUY + Số điện thoại của bạn
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <div className="bg-white p-2 rounded-lg border border-gray-200">
                        <Image
                          src={`https://img.vietqr.io/image/TPB-00001650462-compact2.png?amount=${finalTotal}&addInfo=KAHUY+${form.phone || 'DH'}&accountName=CHAU%20HUY`}
                          alt="QR TPBank"
                          width={140}
                          height={140}
                          className="rounded"
                          unoptimized
                        />
                        <p className="text-xs text-center text-gray-500 mt-1">Quét QR để thanh toán</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* MoMo */}
              {paymentMethod === 'MOMO' && (
                <div className="mt-4 p-4 bg-pink-50 rounded-xl border border-pink-100">
                  <h3 className="font-bold text-pink-700 mb-3">Thanh toán MoMo</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Số MoMo:</span>
                        <span className="font-bold text-gray-800 font-mono">0337804474</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tên:</span>
                        <span className="font-bold text-gray-800">CHAU HUY</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Số tiền:</span>
                        <span className="font-bold text-primary-500">{formatPrice(finalTotal)}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        Nội dung: KAHUY + Số điện thoại của bạn
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <div className="bg-white p-2 rounded-lg border border-gray-200">
                        <Image
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=2|99|0337804474|CHAU%20HUY||0|0|${finalTotal}|KAHUY%20${form.phone || 'DH'}|transfer_myqr`}
                          alt="QR MoMo"
                          width={140}
                          height={140}
                          className="rounded"
                          unoptimized
                        />
                        <p className="text-xs text-center text-gray-500 mt-1">Quét QR MoMo</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Order summary */}
          <div className="lg:col-span-1">
            <div className="card p-5 sticky top-24">
              <h2 className="font-black text-gray-900 text-lg mb-4">Đơn Hàng ({items.length})</h2>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {items.map(item => (
                  <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-3 text-sm">
                    <div className="relative w-12 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50">
                      <Image
                        src={item.image || 'https://picsum.photos/seed/default/120/160'}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 line-clamp-2 leading-tight">{item.productName}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{item.size} · {item.color} · x{item.quantity}</p>
                      <p className="text-primary-500 font-bold mt-0.5">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t mt-4 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí ship</span>
                  <span className={shippingFee === 0 ? 'text-green-600 font-medium' : ''}>
                    {shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-base border-t pt-2">
                  <span>Tổng cộng</span>
                  <span className="text-primary-500 text-lg">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full mt-4 text-base flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Đang xử lý...
                  </>
                ) : (
                  '✓ Đặt Hàng Ngay'
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
