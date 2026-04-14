import { notFound } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { formatPrice, statusLabel, paymentLabel } from '@/lib/utils'

async function getOrder(id: string) {
  return await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  })
}

export default async function OrderConfirmationPage({ params }: { params: { id: string } }) {
  const order = await getOrder(params.id)
  if (!order) notFound()

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      {/* Success */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">
          Đặt Hàng Thành Công! 🎉
        </h1>
        <p className="text-gray-500">
          Cảm ơn bạn đã tin tưởng KAHUYSHOP. Đơn hàng của bạn đang được xử lý!
        </p>
      </div>

      {/* Order info */}
      <div className="card p-5 mb-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="font-black text-gray-900 text-lg">Thông tin đơn hàng</h2>
            <p className="text-xs text-gray-400 font-mono mt-0.5">#{order.id}</p>
          </div>
          <span className={`badge px-3 py-1 text-sm font-semibold ${
            order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
          }`}>
            {statusLabel(order.status)}
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 text-sm mb-5">
          <div>
            <span className="text-gray-500">Người nhận:</span>
            <p className="font-semibold text-gray-800">{order.customerName}</p>
          </div>
          <div>
            <span className="text-gray-500">Điện thoại:</span>
            <p className="font-semibold text-gray-800">{order.phone}</p>
          </div>
          <div className="sm:col-span-2">
            <span className="text-gray-500">Địa chỉ:</span>
            <p className="font-semibold text-gray-800">{order.address}</p>
          </div>
          {order.note && (
            <div className="sm:col-span-2">
              <span className="text-gray-500">Ghi chú:</span>
              <p className="font-semibold text-gray-800">{order.note}</p>
            </div>
          )}
          <div>
            <span className="text-gray-500">Thanh toán:</span>
            <p className="font-semibold text-gray-800">{paymentLabel(order.paymentMethod)}</p>
          </div>
          <div>
            <span className="text-gray-500">Ngày đặt:</span>
            <p className="font-semibold text-gray-800">
              {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })}
            </p>
          </div>
        </div>

        {/* Items */}
        <div className="border-t pt-4">
          <h3 className="font-bold text-gray-800 mb-3">Sản phẩm đã đặt</h3>
          <div className="space-y-2">
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between items-start text-sm">
                <div>
                  <span className="font-medium text-gray-800">{item.productName}</span>
                  <span className="text-gray-500 ml-2">({item.size} · {item.color}) x{item.quantity}</span>
                </div>
                <span className="font-bold text-gray-800 flex-shrink-0 ml-2">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t mt-3 pt-3 flex justify-between font-bold">
            <span className="text-gray-800">Tổng cộng</span>
            <span className="text-primary-500 text-lg">{formatPrice(order.totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Payment reminder */}
      {(order.paymentMethod === 'BANK' || order.paymentMethod === 'MOMO') && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-sm">
          <div className="font-bold text-yellow-800 mb-1">⚠️ Nhắc nhở thanh toán</div>
          {order.paymentMethod === 'BANK' && (
            <p className="text-yellow-700">
              Vui lòng chuyển khoản <strong>{formatPrice(order.totalAmount)}</strong> đến tài khoản{' '}
              <strong>TPBank - 00001650462 - CHAU HUY</strong>.{' '}
              Nội dung: <strong>KAHUY {order.phone}</strong>
            </p>
          )}
          {order.paymentMethod === 'MOMO' && (
            <p className="text-yellow-700">
              Vui lòng chuyển <strong>{formatPrice(order.totalAmount)}</strong> qua MoMo số{' '}
              <strong>0337804474</strong> (CHAU HUY).{' '}
              Nội dung: <strong>KAHUY {order.phone}</strong>
            </p>
          )}
        </div>
      )}

      {/* Contact */}
      <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 mb-6 text-sm text-center">
        <p className="text-gray-600">
          Cần hỗ trợ? Liên hệ ngay:{' '}
          <a href="tel:0337804474" className="font-bold text-primary-500 hover:underline">0337804474</a>
          {' '} hoặc{' '}
          <a href="mailto:buvutu11@gmail.com" className="font-bold text-primary-500 hover:underline">buvutu11@gmail.com</a>
        </p>
      </div>

      <div className="flex gap-3 justify-center">
        <Link href="/products" className="btn-primary">
          Tiếp Tục Mua Sắm →
        </Link>
        <Link href="/" className="btn-secondary">
          Trang Chủ
        </Link>
      </div>
    </div>
  )
}
