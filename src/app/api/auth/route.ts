import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import prisma from '@/lib/prisma'
import { generateToken, } from '@/lib/utils'
import { SESSION_COOKIE } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json()
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

    if (password !== adminPassword) {
      return NextResponse.json({ error: 'Mật khẩu không đúng' }, { status: 401 })
    }

    const token = generateToken()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

    await prisma.adminSession.create({ data: { token, expiresAt } })

    const cookieStore = cookies()
    cookieStore.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/',
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi đăng nhập' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const cookieStore = cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (token) {
    await prisma.adminSession.deleteMany({ where: { token } })
    cookieStore.delete(SESSION_COOKIE)
  }
  return NextResponse.json({ success: true })
}
