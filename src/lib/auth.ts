import { cookies } from 'next/headers'
import { sign, verify } from 'jsonwebtoken'

const SESSION_COOKIE = 'admin_session'
const JWT_SECRET = process.env.JWT_SECRET || process.env.ADMIN_PASSWORD || 'kahuyshop-secret-key'

export interface JWTPayload {
  role: string
  iat: number
  exp: number
}

export async function createAdminSession(): Promise<string> {
  const token = sign(
    { role: 'admin' },
    JWT_SECRET,
    { expiresIn: '24h' }
  )
  return token
}

export async function validateAdminSession(): Promise<boolean> {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get(SESSION_COOKIE)?.value
    if (!token) return false

    verify(token, JWT_SECRET) as JWTPayload
    return true
  } catch {
    return false
  }
}

export async function deleteAdminSession(): Promise<void> {
  // JWT is stateless, client handles removal
}

export function verifyPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
  return password === adminPassword
}

export { SESSION_COOKIE }
