# KAHUYSHOP 🛍️

Website bán quần áo KAHUYSHOP — xây dựng bằng Next.js 14, Tailwind CSS, Prisma.

## Thông Tin Shop
- **Tên shop:** KAHUYSHOP
- **Điện thoại:** 0337804474
- **Email:** buvutu11@gmail.com
- **Địa chỉ:** Ấp mới 2, xã Mỹ Hạnh, Đức Hòa, Tây Ninh

## Cài Đặt Local

### 1. Clone và cài dependencies
```bash
cd kahuyshop
npm install
```

### 2. Tạo file .env
```bash
cp .env.example .env
```
Chỉnh sửa `.env`:
```
DATABASE_URL="file:./dev.db"
ADMIN_PASSWORD="matkhaucuaban"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Khởi tạo database
```bash
npm run db:push
npm run db:seed
```

### 4. Chạy dev server
```bash
npm run dev
```
Truy cập: http://localhost:3000

## Deploy lên Vercel

### 1. Tạo Neon Postgres database
- Đăng ký tại https://neon.tech (miễn phí)
- Tạo database mới, copy connection string

### 2. Cài Prisma adapter cho Neon
```bash
npm install @prisma/adapter-neon @neondatabase/serverless ws
npm install -D @types/ws
```

### 3. Cập nhật .env trên Vercel
```
DATABASE_URL=postgresql://user:pass@host/dbname?sslmode=require
ADMIN_PASSWORD=matkhauadmin
NEXT_PUBLIC_APP_URL=https://yoursite.vercel.app
```

### 4. Deploy
```bash
# Cài Vercel CLI
npm i -g vercel
vercel --prod
```

### 5. Seed data trên production
```bash
DATABASE_URL="your-neon-url" npm run db:seed
```

## Tính Năng

### Trang khách hàng
- 🏠 **Trang chủ** — banner hero + sản phẩm nổi bật
- 🛍️ **Sản phẩm** — lọc theo danh mục, size, màu
- 📦 **Chi tiết sản phẩm** — chọn size/màu, thêm vào giỏ
- 🛒 **Giỏ hàng** — quản lý số lượng
- 💳 **Thanh toán** — COD / Chuyển khoản / MoMo / VNPay

### Trang admin (/admin)
- 📊 **Dashboard** — thống kê đơn hàng, doanh thu
- 👕 **Sản phẩm** — thêm/sửa/xóa sản phẩm
- 📋 **Đơn hàng** — xem và cập nhật trạng thái

## Thông Tin Thanh Toán
- **TPBank:** 00001650462 — CHAU HUY
- **MoMo:** 0337804474
- **VNPay:** Sắp ra mắt

## Tech Stack
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** (màu chủ đạo: #E91E63)
- **Prisma ORM**
- **SQLite** (local) / **Neon Postgres** (production)
