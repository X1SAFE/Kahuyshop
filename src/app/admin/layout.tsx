import { redirect } from 'next/navigation'
import { validateAdminSession } from '@/lib/auth'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const isValid = await validateAdminSession()
  if (!isValid) {
    redirect('/admin/login')
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 ml-0 md:ml-56 p-4 md:p-6">
        {children}
      </main>
    </div>
  )
}
