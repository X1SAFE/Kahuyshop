'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useCart } from '@/hooks/useCart'

export default function Header() {
  const { count } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/', label: 'Trang Chủ' },
    { href: '/products', label: 'Sản Phẩm' },
    { href: '/products?category=Áo', label: 'Áo' },
    { href: '/products?category=Quần', label: 'Quần' },
    { href: '/products?category=Váy', label: 'Váy' },
    { href: '/products?category=Phụ kiện', label: 'Phụ Kiện' },
  ]

  return (
    <header className={`sticky top-0 z-50 bg-white transition-shadow duration-200 ${scrolled ? 'shadow-md' : 'border-b border-gray-100'}`}>
      {/* Top bar */}
      <div className="bg-primary-500 text-white text-center text-xs py-1.5 px-4">
        🚚 Miễn phí giao hàng đơn từ 500.000 ₫ &nbsp;|&nbsp; Hotline: <a href="tel:0337804474" className="font-semibold hover:underline">0337804474</a>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-black text-primary-500 tracking-tight">KAHUY</span>
            <span className="text-2xl font-black text-gray-800 tracking-tight">SHOP</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-primary-500 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex items-center gap-1.5 bg-primary-50 hover:bg-primary-100 text-primary-600 px-3 py-2 rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-sm font-semibold hidden sm:inline">Giỏ hàng</span>
              {count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-1">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2.5 px-3 text-sm font-medium text-gray-700 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
