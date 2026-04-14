import ProductForm from '@/components/admin/ProductForm'

export const metadata = { title: 'Thêm sản phẩm — KAHUYSHOP Admin' }

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-2xl font-black text-gray-900 mb-6">Thêm Sản Phẩm Mới</h1>
      <div className="card p-5 max-w-2xl">
        <ProductForm />
      </div>
    </div>
  )
}
