import { cookies } from 'next/headers'
import prisma from './prisma'

const SESSION_COOKIE = 'admin_session'
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000 // 24 hours

export async function createAdminSession(token: string): Promise<void> {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS)
  await prisma.adminSession.create({
    data: { token, expiresAt },
  })
}

export async function validateAdminSession(): Promise<boolean> {
  const cookieStore = cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return false

  const session = await prisma.adminSession.findUnique({
    where: { token },
  })

  if (!session) return false
  if (session.expiresAt < new Date()) {
    await prisma.adminSession.delete({ where: { token } })
    return false
  }

  return true
}

export async function deleteAdminSession(token: string): Promise<void> {
  await prisma.adminSession.deleteMany({ where: { token } })
}

export { SESSION_COOKIE }
