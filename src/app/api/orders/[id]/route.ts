import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { validateAdminSession } from '@/lib/auth'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true },
  })
  if (!order) return NextResponse.json({ error: 'Không tìm thấy đơn hàng' }, { status: 404 })
  return NextResponse.json(order)
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const isAdmin = await validateAdminSession()
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { status } = await req.json()
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Trạng thái không hợp lệ' }, { status: 400 })
    }

    const order = await prisma.order.update({
      where: { id: params.id },
      data: { status },
      include: { items: true },
    })

    return NextResponse.json(order)
  } catch {
    return NextResponse.json({ error: 'Lỗi cập nhật đơn hàng' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const isAdmin = await validateAdminSession()
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await prisma.order.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
