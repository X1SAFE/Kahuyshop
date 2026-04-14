import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { validateAdminSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')

    const products = await prisma.product.findMany({
      where: category ? { category } : undefined,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(products)
  } catch {
    return NextResponse.json({ error: 'Lỗi lấy sản phẩm' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const isAdmin = await validateAdminSession()
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const { name, description, price, images, category, sizes, colors, stock } = body

    if (!name || !price || !category) {
      return NextResponse.json({ error: 'Thiếu thông tin sản phẩm' }, { status: 400 })
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || '',
        price: Number(price),
        images: JSON.stringify(Array.isArray(images) ? images : [images].filter(Boolean)),
        category,
        sizes: JSON.stringify(Array.isArray(sizes) ? sizes : []),
        colors: JSON.stringify(Array.isArray(colors) ? colors : []),
        stock: Number(stock) || 0,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Lỗi tạo sản phẩm' }, { status: 500 })
  }
}
