export const dynamic = 'force-dynamic'

import Link from 'next/link'
import Image from 'next/image'
import prisma from '@/lib/prisma'
import { safeJsonParse, formatPrice } from '@/lib/utils'
import AdminProductActions from '@/components/admin/AdminProductActions'

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Sản Phẩm</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} sản phẩm</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary text-sm">
          + Thêm sản phẩm
        </Link>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Sản phẩm</th>
                <th className="px-4 py-3 text-left hidden sm:table-cell">Danh mục</th>
                <th className="px-4 py-3 text-left">Giá</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Kho</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map(product => {
                const images = safeJsonParse<string[]>(product.images, [])
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          {images[0] ? (
                            <Image src={images[0]} alt={product.name} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">👕</div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800 line-clamp-1">{product.name}</div>
                          <div className="text-xs text-gray-400">ID: {product.id.slice(-8)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="badge bg-gray-100 text-gray-600">{product.category}</span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-primary-500">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`font-medium ${product.stock === 0 ? 'text-red-500' : 'text-gray-700'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <AdminProductActions productId={product.id} />
                    </td>
                  </tr>
                )
              })}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                    Chưa có sản phẩm nào.{' '}
                    <Link href="/admin/products/new" className="text-primary-500 hover:underline">
                      Thêm ngay
                    </Link>
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
