import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { safeJsonParse } from '@/lib/utils'
import { Product } from '@/types'
import ProductDetailClient from '@/components/shop/ProductDetailClient'

async function getProduct(id: string): Promise<Product | null> {
  const product = await prisma.product.findUnique({ where: { id } })
  if (!product) return null
  return {
    ...product,
    images: safeJsonParse<string[]>(product.images, []),
    sizes: safeJsonParse<string[]>(product.sizes, []),
    colors: safeJsonParse<string[]>(product.colors, []),
    createdAt: product.createdAt.toISOString(),
  }
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)
  if (!product) return {}
  return {
    title: `${product.name} — KAHUYSHOP`,
    description: product.description.substring(0, 160),
  }
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)
  if (!product) notFound()

  return <ProductDetailClient product={product} />
}
