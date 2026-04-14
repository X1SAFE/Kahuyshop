import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { customerName, phone, address, note, paymentMethod, totalAmount, items } = body

    if (!customerName || !phone || !address || !paymentMethod || !items?.length) {
      return NextResponse.json({ error: 'Thiếu thông tin đơn hàng' }, { status: 400 })
    }

    const order = await prisma.order.create({
      data: {
        customerName,
        phone,
        address,
        note: note || null,
        paymentMethod,
        status: 'pending',
        totalAmount,
        items: {
          create: items.map((item: {
            productId: string
            productName: string
            size: string
            color: string
            quantity: number
            price: number
          }) => ({
            productId: item.productId || null,
            productName: item.productName,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: true },
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json({ error: 'Lỗi tạo đơn hàng' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')

    const orders = await prisma.order.findMany({
      where: status ? { status } : undefined,
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi lấy đơn hàng' }, { status: 500 })
  }
}
