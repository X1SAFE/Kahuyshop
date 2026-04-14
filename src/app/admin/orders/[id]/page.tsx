import Link from 'next/link'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { formatPrice, statusLabel, statusColor, paymentLabel } from '@/lib/utils'
import AdminOrderStatusUpdater from '@/components/admin/AdminOrderStatusUpdater'

async function getOrder(id: string) {
  return await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  })
}

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const order = await getOrder(params.id)
  if (!order) notFound()

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/orders" className="text-sm text-gray-500 hover:text-primary-500 flex items-center gap-1 mb-2">
          ← Quay lại đơn hàng
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-gray-900">
            Đơn Hàng #{order.id.slice(-8)}
          </h1>
          <span className={`badge text-sm px-3 py-1 ${statusColor(order.status)}`}>
            {statusLabel(order.status)}
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Products */}
          <div className="card p-5">
            <h2 className="font-black text-gray-900 mb-4">Sản phẩm đặt mua</h2>
            <div className="space-y-3">
              {order.items.map(item => (
                <div key={item.id} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">{item.productName}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      Size: {item.size} · Màu: {item.color} · x{item.quantity}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary-500">{formatPrice(item.price * item.quantity)}</div>
                    <div className="text-xs text-gray-400">{formatPrice(item.price)} /sp</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t mt-4 pt-4 flex justify-between items-center">
              <span className="text-gray-600">Tổng cộng</span>
              <span className="text-xl font-black text-primary-500">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>

          {/* Status update */}
          <AdminOrderStatusUpdater orderId={order.id} currentStatus={order.status} />
        </div>

        <div className="space-y-6">
          {/* Customer info */}
          <div className="card p-5">
            <h2 className="font-black text-gray-900 mb-4">Thông tin khách hàng</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-500">Họ tên:</span>
                <p className="font-semibold text-gray-800">{order.customerName}</p>
              </div>
              <div>
                <span className="text-gray-500">Số điện thoại:</span>
                <p className="font-semibold text-gray-800">{order.phone}</p>
              </div>
              <div>
                <span className="text-gray-500">Địa chỉ giao hàng:</span>
                <p className="font-semibold text-gray-800">{order.address}</p>
              </div>
              {order.note && (
                <div>
                  <span className="text-gray-500">Ghi chú:</span>
                  <p className="font-semibold text-gray-800">{order.note}</p>
                </div>
              )}
            </div>
          </div>

          {/* Payment info */}
          <div className="card p-5">
            <h2 className="font-black text-gray-900 mb-4">Thanh toán</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-500">Phương thức:</span>
                <p className="font-semibold text-gray-800">{paymentLabel(order.paymentMethod)}</p>
              </div>
              <div>
                <span className="text-gray-500">Mã đơn:</span>
                <p className="font-mono text-xs text-gray-600">{order.id}</p>
              </div>
              <div>
                <span className="text-gray-500">Ngày đặt:</span>
                <p className="font-semibold text-gray-800">
                  {new Date(order.createdAt).toLocaleString('vi-VN')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
