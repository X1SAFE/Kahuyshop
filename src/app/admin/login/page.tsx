import { redirect } from 'next/navigation'
import { validateAdminSession } from '@/lib/auth'
import AdminLoginForm from '@/components/admin/AdminLoginForm'

export const metadata = { title: 'Đăng nhập Admin — KAHUYSHOP' }

export default async function AdminLoginPage() {
  const isValid = await validateAdminSession()
  if (isValid) redirect('/admin')

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-3xl font-black mb-1">
            <span className="text-primary-500">KAHUY</span>
            <span className="text-gray-800">SHOP</span>
          </div>
          <p className="text-gray-500 text-sm">Quản lý cửa hàng</p>
        </div>
        <div className="card p-6">
          <h1 className="text-xl font-black text-gray-800 mb-5">Đăng Nhập Admin</h1>
          <AdminLoginForm />
        </div>
      </div>
    </div>
  )
}
