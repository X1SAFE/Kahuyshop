/**
 * Format price as Vietnamese currency
 * e.g. 150000 => "150.000 ₫"
 */
export function formatPrice(price: number): string {
  return price.toLocaleString('vi-VN') + ' ₫'
}

/**
 * Parse JSON safely
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T
  } catch {
    return fallback
  }
}

/**
 * Generate a random token
 */
export function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

/**
 * Map status to Vietnamese label
 */
export function statusLabel(status: string): string {
  const map: Record<string, string> = {
    pending: 'Chờ xác nhận',
    processing: 'Đang xử lý',
    shipped: 'Đang giao hàng',
    delivered: 'Đã giao',
    cancelled: 'Đã hủy',
  }
  return map[status] ?? status
}

/**
 * Map status to color class
 */
export function statusColor(status: string): string {
  const map: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }
  return map[status] ?? 'bg-gray-100 text-gray-800'
}

/**
 * Map payment method to Vietnamese label
 */
export function paymentLabel(method: string): string {
  const map: Record<string, string> = {
    COD: 'Thanh toán khi nhận hàng',
    BANK: 'Chuyển khoản ngân hàng',
    MOMO: 'Ví MoMo',
    VNPAY: 'VNPay',
  }
  return map[method] ?? method
}
