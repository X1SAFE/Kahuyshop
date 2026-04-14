export const dynamic = 'force-dynamic'

import Link from 'next/link'
import prisma from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { status?: string }
}) {
  const status = searchParams.status

  const orders = await prisma.order.findMany({
    where: status ? { status } : undefined,
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  })

  const statusLabel: Record<string, string> = {
    pending: 'Chờ xác nhận',
    processing: 'Đang xử lý',
    shipped: 'Đang giao',
    delivered: 'Đã giao',
    cancelled: 'Đã hủy',
  }

  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  }

  const filters = [
    { label: 'Tất cả', value: '' },
    { label: 'Chờ xác nhận', value: 'pending' },
    { label: 'Đang xử lý', value: 'processing' },
    { label: 'Đang giao', value: 'shipped' },
    { label: 'Đã giao', value: 'delivered' },
    { label: 'Đã hủy', value: 'cancelled' },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Quản Lý Đơn Hàng</h1>
        <p className="text-gray-500 text-sm mt-1">{orders.length} đơn hàng</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {filters.map(f => (
          <Link
            key={f.value}
            href={f.value ? `/admin/orders?status=${f.value}` : '/admin/orders'}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              (status || '') === f.value
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-5 py-3 text-left">Mã đơn</th>
                <th className="px-5 py-3 text-left">Khách hàng</th>
                <th className="px-5 py-3 text-left hidden sm:table-cell">Sản phẩm</th>
                <th className="px-5 py-3 text-left hidden md:table-cell">Thanh toán</th>
                <th className="px-5 py-3 text-left">Tổng tiền</th>
                <th className="px-5 py-3 text-left">Trạng thái</th>
                <th className="px-5 py-3 text-left hidden lg:table-cell">Ngày đặt</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-xs text-gray-500">#{order.id.slice(-8)}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-gray-800">{order.customerName}</div>
                    <div className="text-xs text-gray-400">{order.phone}</div>
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell text-gray-500 text-xs">
                    {order.items.length} sản phẩm
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell text-gray-500 text-xs">
                    {order.paymentMethod === 'cod' ? 'COD' :
                     order.paymentMethod === 'bank' ? 'Chuyển khoản' :
                     order.paymentMethod === 'momo' ? 'MoMo' : 'VNPay'}
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-gray-800 text-sm">
                    {formatPrice(order.totalAmount)}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[order.status] || 'bg-gray-100 text-gray-600'}`}>
                      {statusLabel[order.status] || order.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 hidden lg:table-cell text-gray-400 text-xs">
                    {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-5 py-3.5">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-primary-500 hover:underline text-xs font-medium"
                    >
                      Chi tiết →
                    </Link>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-gray-400">
                    Không có đơn hàng nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
