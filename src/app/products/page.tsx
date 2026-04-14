export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import prisma from '@/lib/prisma'
import { safeJsonParse } from '@/lib/utils'
import { Product } from '@/types'
import ProductGrid from '@/components/shop/ProductGrid'
import ProductFilters from '@/components/shop/ProductFilters'

async function getProducts(category?: string, size?: string, color?: string): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: {
      ...(category ? { category } : {}),
    },
    orderBy: { createdAt: 'desc' },
  })

  let result = products.map(p => ({
    ...p,
    images: safeJsonParse<string[]>(p.images, []),
    sizes: safeJsonParse<string[]>(p.sizes, []),
    colors: safeJsonParse<string[]>(p.colors, []),
    createdAt: p.createdAt.toISOString(),
  }))

  if (size) {
    result = result.filter(p => p.sizes.includes(size))
  }
  if (color) {
    result = result.filter(p => p.colors.some(c => c.toLowerCase().includes(color.toLowerCase())))
  }

  return result
}

async function getAllCategories(): Promise<string[]> {
  const products = await prisma.product.findMany({ select: { category: true } })
  return Array.from(new Set(products.map(p => p.category))).sort()
}

async function getAllSizes(): Promise<string[]> {
  const products = await prisma.product.findMany({ select: { sizes: true } })
  const allSizes = products.flatMap(p => safeJsonParse<string[]>(p.sizes, []))
  return Array.from(new Set(allSizes))
}

interface PageProps {
  searchParams: { category?: string; size?: string; color?: string; q?: string }
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const { category, size, color } = searchParams
  const [products, categories, sizes] = await Promise.all([
    getProducts(category, size, color),
    getAllCategories(),
    getAllSizes(),
  ])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900">
          {category ? category : 'Tất Cả Sản Phẩm'}
        </h1>
        <p className="text-gray-500 mt-1">{products.length} sản phẩm</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters sidebar */}
        <aside className="w-full lg:w-56 flex-shrink-0">
          <Suspense>
            <ProductFilters
              categories={categories}
              sizes={sizes}
              activeCategory={category}
              activeSize={size}
              activeColor={color}
            />
          </Suspense>
        </aside>

        {/* Products */}
        <div className="flex-1">
          <ProductGrid products={products} emptyMessage="Không tìm thấy sản phẩm phù hợp với bộ lọc." />
        </div>
      </div>
    </div>
  )
}
