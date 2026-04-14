import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import ProductForm from '@/components/admin/ProductForm'

export const metadata = { title: 'Chỉnh sửa sản phẩm — KAHUYSHOP Admin' }

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({ where: { id: params.id } })
  if (!product) notFound()

  return (
    <div>
      <h1 className="text-2xl font-black text-gray-900 mb-6">Chỉnh Sửa Sản Phẩm</h1>
      <div className="card p-5 max-w-2xl">
        <ProductForm product={product} />
      </div>
    </div>
  )
}
