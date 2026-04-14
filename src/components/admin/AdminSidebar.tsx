'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

const links = [
  { href: '/admin', label: 'Tổng Quan', icon: '📊', exact: true },
  { href: '/admin/products', label: 'Sản Phẩm', icon: '👕' },
  { href: '/admin/orders', label: 'Đơn Hàng', icon: '📦' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' })
    router.push('/admin/login')
    router.refresh()
  }

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 h-14 flex items-center justify-between">
        <div className="font-black text-lg">
          <span className="text-primary-500">KAHUY</span><span className="text-gray-800">SHOP</span>
          <span className="text-xs font-normal text-gray-400 ml-2">Admin</span>
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-lg hover:bg-gray-100">
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile overlay */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/30" onClick={() => setMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-56 bg-white border-r border-gray-200 z-50 flex flex-col
        transition-transform duration-200
        ${menuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="p-5 border-b border-gray-100">
          <div className="font-black text-xl">
            <span className="text-primary-500">KAHUY</span><span className="text-gray-800">SHOP</span>
          </div>
          <div className="text-xs text-gray-400 mt-0.5 font-medium">Quản lý cửa hàng</div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                isActive(link.href, link.exact)
                  ? 'bg-primary-50 text-primary-600 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="text-base">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-gray-100">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <span>🌐</span> Xem website
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors mt-1"
          >
            <span>🚪</span> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Spacer for mobile */}
      <div className="md:hidden h-14" />
    </>
  )
}
