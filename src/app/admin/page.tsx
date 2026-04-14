export const dynamic = 'force-dynamic'

import Link from 'next/link'
import prisma from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'

async function getDashboardStats() {
  const [totalOrders, pendingOrders, totalProducts, recentOrders] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: 'pending' } }),
    prisma.product.count(),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    }),
  ])

  const revenue = await prisma.order.aggregate({
    where: { status: { in: ['delivered', 'shipped'] } },
    _sum: { totalAmount: true },
  })

  return { totalOrders, pendingOrders, totalProducts, recentOrders, revenue: revenue._sum.totalAmount || 0 }
}

export default async function AdminDashboard() {
  const { totalOrders, pendingOrders, totalProducts, recentOrders, revenue } = await getDashboardStats()

  const stats = [
    { label: 'Tổng đơn hàng', value: totalOrders.toString(), icon: '📦', color: 'bg-blue-50 text-blue-600', link: '/admin/orders' },
    { label: 'Đơn chờ xác nhận', value: pendingOrders.toString(), icon: '⏳', color: 'bg-yellow-50 text-yellow-600', link: '/admin/orders?status=pending' },
    { label: 'Sản phẩm', value: totalProducts.toString(), icon: '👕', color: 'bg-green-50 text-green-600', link: '/admin/products' },
    { label: 'Doanh thu', value: formatPrice(revenue), icon: '💰', color: 'bg-primary-50 text-primary-600', link: '/admin/orders' },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Tổng Quan</h1>
        <p className="text-gray-500 text-sm mt-1">Chào mừng đến với trang quản lý KAHUYSHOP</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(stat => (
          <Link key={stat.label} href={stat.link} className="card p-4 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center text-xl mb-3`}>
              {stat.icon}
            </div>
            <div className="text-xl font-black text-gray-900">{stat.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="card">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-black text-gray-900">Đơn Hàng Mới Nhất</h2>
          <Link href="/admin/orders" className="text-sm text-primary-500 hover:underline">
            Xem tất cả →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-5 py-3 text-left">Mã đơn</th>
                <th className="px-5 py-3 text-left">Khách hàng</th>
                <th className="px-5 py-3 text-left hidden sm:table-cell">Số tiền</th>
                <th className="px-5 py-3 text-left">Trạng thái</th>
                <th className="px-5 py-3 text-left hidden md:table-cell">Ngày đặt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <Link href={`/admin/orders/${order.id}`} className="font-mono text-xs text-primary-500 hover:underline">
                      #{order.id.slice(-8)}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-gray-800">{order.customerName}</div>
                    <div className="text-xs text-gray-400">{order.phone}</div>
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell font-semibold text-gray-800">
                    {formatPrice(order.totalAmount)}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`badge text-xs ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {order.status === 'pending' ? 'Chờ xác nhận' :
                       order.status === 'processing' ? 'Đang xử lý' :
                       order.status === 'shipped' ? 'Đang giao' :
                       order.status === 'delivered' ? 'Đã giao' : 'Đã hủy'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell text-gray-400 text-xs">
                    {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-gray-400">
                    Chưa có đơn hàng nào
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
