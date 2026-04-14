import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { validateAdminSession } from '@/lib/auth'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({ where: { id: params.id } })
  if (!product) return NextResponse.json({ error: 'Không tìm thấy' }, { status: 404 })
  return NextResponse.json(product)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const isAdmin = await validateAdminSession()
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const { name, description, price, images, category, sizes, colors, stock } = body

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        description,
        price: Number(price),
        images: JSON.stringify(Array.isArray(images) ? images : [images].filter(Boolean)),
        category,
        sizes: JSON.stringify(Array.isArray(sizes) ? sizes : []),
        colors: JSON.stringify(Array.isArray(colors) ? colors : []),
        stock: Number(stock) || 0,
      },
    })

    return NextResponse.json(product)
  } catch {
    return NextResponse.json({ error: 'Lỗi cập nhật sản phẩm' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const isAdmin = await validateAdminSession()
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await prisma.product.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
