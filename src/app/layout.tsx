import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin', 'vietnamese'] })

export const metadata: Metadata = {
  title: 'KAHUYSHOP - Thời Trang Chất Lượng',
  description: 'Cửa hàng thời trang KAHUYSHOP - Áo, Quần, Váy, Phụ kiện chất lượng cao, giá tốt. Giao hàng toàn quốc.',
  keywords: 'thời trang, áo, quần, váy, phụ kiện, kahuyshop, tây ninh',
  openGraph: {
    title: 'KAHUYSHOP - Thời Trang Chất Lượng',
    description: 'Cửa hàng thời trang KAHUYSHOP - Áo, Quần, Váy, Phụ kiện chất lượng cao, giá tốt.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
