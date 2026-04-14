export interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  sizes: string[]
  colors: string[]
  stock: number
  createdAt: string
}

export interface CartItem {
  productId: string
  productName: string
  price: number
  image: string
  size: string
  color: string
  quantity: number
}

export interface Order {
  id: string
  customerName: string
  phone: string
  address: string
  note: string | null
  paymentMethod: string
  status: string
  totalAmount: number
  createdAt: string
  items: OrderItem[]
}

export interface OrderItem {
  id: string
  productId: string | null
  productName: string
  size: string
  color: string
  quantity: number
  price: number
}

export type PaymentMethod = 'COD' | 'BANK' | 'MOMO' | 'VNPAY'
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
