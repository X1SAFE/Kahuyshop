export const dynamic = 'force-dynamic'

import Link from 'next/link'
import Image from 'next/image'
import prisma from '@/lib/prisma'
import { safeJsonParse } from '@/lib/utils'
import { Product } from '@/types'
import ProductGrid from '@/components/shop/ProductGrid'

async function getFeaturedProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    take: 8,
    orderBy: { createdAt: 'desc' },
  })
  return products.map(p => ({
    ...p,
    images: safeJsonParse<string[]>(p.images, []),
    sizes: safeJsonParse<string[]>(p.sizes, []),
    colors: safeJsonParse<string[]>(p.colors, []),
    createdAt: p.createdAt.toISOString(),
  }))
}

export default async function HomePage() {
  const products = await getFeaturedProducts()
  const categories = [
    { name: 'Áo', icon: '👕', image: 'https://picsum.photos/seed/catao/400/300', desc: 'Áo thun, sơ mi, áo khoác' },
    { name: 'Quần', icon: '👖', image: 'https://picsum.photos/seed/catquan/400/300', desc: 'Quần jean, kaki, short' },
    { name: 'Váy', icon: '👗', image: 'https://picsum.photos/seed/catvay/400/300', desc: 'Váy maxi, váy ngắn, đầm' },
    { name: 'Phụ kiện', icon: '👜', image: 'https://picsum.photos/seed/catpk/400/300', desc: 'Túi xách, thắt lưng, mũ' },
  ]

  return (
    <>
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-pink-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-block bg-primary-100 text-primary-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                ✨ Bộ sưu tập mới 2024
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-4">
                Thời Trang{' '}
                <span className="text-primary-500">Đẹp &amp; Cá Tính</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Khám phá bộ sưu tập thời trang mới nhất tại KAHUYSHOP — 
                chất lượng tốt, giá phải chăng, giao hàng nhanh toàn quốc.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/products" className="btn-primary text-base">
                  Mua Sắm Ngay →
                </Link>
                <Link href="/products?category=Váy" className="btn-outline text-base">
                  Xem Váy Mới
                </Link>
              </div>
              {/* Trust badges */}
              <div className="flex flex-wrap gap-4 mt-8 text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <span className="text-green-500">✓</span> Miễn phí đổi trả
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-green-500">✓</span> Giao hàng toàn quốc
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-green-500">✓</span> Hàng chính hãng
                </div>
              </div>
            </div>
            <div className="relative hidden md:block">
              <div className="grid grid-cols-2 gap-3">
                <div className="relative rounded-2xl overflow-hidden aspect-[3/4] shadow-lg">
                  <Image
                    src="https://picsum.photos/seed/hero1/400/533"
                    alt="Fashion 1"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="relative rounded-2xl overflow-hidden aspect-[3/4] shadow-lg mt-8">
                  <Image
                    src="https://picsum.photos/seed/hero2/400/533"
                    alt="Fashion 2"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-100 rounded-full opacity-30 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-pink-100 rounded-full opacity-40 blur-2xl" />
      </section>

      {/* Categories */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">Danh Mục Sản Phẩm</h2>
            <p className="text-gray-500 mt-2">Khám phá đa dạng mẫu mã thời trang</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map(cat => (
              <Link
                key={cat.name}
                href={`/products?category=${encodeURIComponent(cat.name)}`}
                className="group relative rounded-2xl overflow-hidden aspect-square shadow-sm hover:shadow-lg transition-shadow"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <div className="text-2xl mb-1">{cat.icon}</div>
                  <div className="font-bold text-lg leading-tight">{cat.name}</div>
                  <div className="text-xs text-gray-200 mt-0.5">{cat.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900">Sản Phẩm Nổi Bật</h2>
              <p className="text-gray-500 mt-1">Những mẫu được yêu thích nhất</p>
            </div>
            <Link href="/products" className="text-primary-500 hover:text-primary-600 font-semibold text-sm flex items-center gap-1">
              Xem tất cả →
            </Link>
          </div>
          <ProductGrid products={products} />
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-12 bg-primary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
            🎉 Ưu Đãi Hôm Nay!
          </h2>
          <p className="text-primary-100 text-lg mb-6">
            Miễn phí giao hàng cho đơn từ 500.000 ₫ — Nhận hàng trong 2–5 ngày
          </p>
          <Link href="/products" className="inline-block bg-white text-primary-500 font-bold px-8 py-3 rounded-xl hover:bg-primary-50 transition-colors">
            Mua Sắm Ngay
          </Link>
        </div>
      </section>

      {/* Why us */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: '🚚', title: 'Giao Hàng Nhanh', desc: 'Toàn quốc 2–5 ngày' },
              { icon: '🔄', title: 'Đổi Trả Dễ Dàng', desc: '7 ngày miễn phí đổi' },
              { icon: '💯', title: 'Hàng Chất Lượng', desc: 'Kiểm định kỹ lưỡng' },
              { icon: '🛡️', title: 'Thanh Toán An Toàn', desc: 'Đa dạng hình thức' },
            ].map(item => (
              <div key={item.title} className="p-4">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-gray-800 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
