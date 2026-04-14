import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const products = [
  {
    name: 'Áo Thun Basic Trắng',
    description: 'Áo thun cotton 100%, form regular fit, thoáng mát, phù hợp mặc hàng ngày.',
    price: 150000,
    category: 'Áo',
    images: ['/products/product-01.jpg', '/products/product-02.jpg'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Trắng', 'Đen', 'Xám'],
    stock: 50,
  },
  {
    name: 'Áo Sơ Mi Kẻ Sọc',
    description: 'Áo sơ mi kẻ sọc nhỏ, chất liệu cotton pha, form slim fit trẻ trung.',
    price: 220000,
    category: 'Áo',
    images: ['/products/product-03.jpg', '/products/product-04.jpg'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Xanh', 'Trắng', 'Hồng'],
    stock: 30,
  },
  {
    name: 'Quần Jean Skinny',
    description: 'Quần jean skinny co giãn 4 chiều, ôm dáng, tôn vóc dáng.',
    price: 350000,
    category: 'Quần',
    images: ['/products/product-05.jpg', '/products/product-06.jpg'],
    sizes: ['26', '27', '28', '29', '30', '31'],
    colors: ['Xanh đậm', 'Xanh nhạt', 'Đen'],
    stock: 40,
  },
  {
    name: 'Quần Short Kaki',
    description: 'Quần short kaki lưng thun, thoải mái, phù hợp đi chơi, dạo phố.',
    price: 180000,
    category: 'Quần',
    images: ['/products/product-07.jpg', '/products/product-08.jpg'],
    sizes: ['M', 'L', 'XL'],
    colors: ['Be', 'Xanh rêu', 'Đen'],
    stock: 35,
  },
  {
    name: 'Váy Hoa Nhí',
    description: 'Váy hoa nhí dáng xòe, chất liệu voan mềm, nữ tính và dễ phối đồ.',
    price: 280000,
    category: 'Váy',
    images: ['/products/product-09.jpg', '/products/product-10.jpg'],
    sizes: ['S', 'M', 'L'],
    colors: ['Hồng', 'Xanh', 'Vàng'],
    stock: 25,
  },
  {
    name: 'Váy Midi Trơn',
    description: 'Váy midi dáng chữ A, màu trơn thanh lịch, phù hợp đi làm và đi chơi.',
    price: 320000,
    category: 'Váy',
    images: ['/products/product-11.jpg', '/products/product-12.jpg'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Đen', 'Trắng', 'Be'],
    stock: 20,
  },
  {
    name: 'Áo Crop Top Gân',
    description: 'Áo crop top chất liệu gân cotton, form ôm, năng động và hiện đại.',
    price: 130000,
    category: 'Áo',
    images: ['/products/product-13.jpg', '/products/product-14.jpg'],
    sizes: ['S', 'M', 'L'],
    colors: ['Trắng', 'Đen', 'Hồng', 'Xanh'],
    stock: 45,
  },
  {
    name: 'Quần Ống Rộng',
    description: 'Quần palazzo ống rộng, chất liệu mềm mại, thoải mái và thời trang.',
    price: 260000,
    category: 'Quần',
    images: ['/products/product-15.jpg', '/products/product-16.jpg'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Đen', 'Trắng', 'Be', 'Xanh navy'],
    stock: 30,
  },
  {
    name: 'Áo Hoodie Nỉ',
    description: 'Hoodie chất liệu nỉ bông dày dặn, ấm áp, form oversize chill.',
    price: 380000,
    category: 'Áo',
    images: ['/products/product-17.jpg', '/products/product-18.jpg'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Xám', 'Đen', 'Nâu', 'Hồng'],
    stock: 28,
  },
  {
    name: 'Phụ Kiện Thắt Lưng Da',
    description: 'Thắt lưng da PU cao cấp, khóa kim loại, phù hợp nhiều outfit.',
    price: 95000,
    category: 'Phụ kiện',
    images: ['/products/product-19.jpg'],
    sizes: ['Free size'],
    colors: ['Đen', 'Nâu'],
    stock: 60,
  },
]

async function main() {
  console.log('🌱 Seeding database...')

  // Delete existing data
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()

  // Create products
  for (const product of products) {
    await prisma.product.create({
      data: {
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        images: JSON.stringify(product.images),
        sizes: JSON.stringify(product.sizes),
        colors: JSON.stringify(product.colors),
        stock: product.stock,
      },
    })
  }

  console.log(`✅ Created ${products.length} products`)
  console.log('🎉 Seed complete!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
