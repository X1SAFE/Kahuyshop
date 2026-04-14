import ProductCard from './ProductCard'
import { Product } from '@/types'

interface ProductGridProps {
  products: Product[]
  emptyMessage?: string
}

export default function ProductGrid({ products, emptyMessage = 'Không có sản phẩm nào.' }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🛍️</div>
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
