import { PrismaClient, OrderStatus } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Seed đơn hàng ảo cho mô hình dự báo doanh thu
 * Tạo dữ liệu cho 12 tháng với xu hướng tăng trưởng
 */
export async function seedOrders() {
  console.log('🛒 Seeding demo orders for revenue prediction...');

  // Lấy users và products để tạo đơn hàng
  const users = await prisma.user.findMany({
    where: {
      role: 'USER',
    },
    take: 10,
  });

  if (users.length === 0) {
    console.log('⚠️  No users found. Please seed users first.');
    return;
  }

  const productDetails = await prisma.productDetail.findMany({
    take: 50,
  });

  if (productDetails.length === 0) {
    console.log('⚠️  No products found. Please seed products first.');
    return;
  }

  // Lấy hoặc tạo shipping address
  let shippingAddress = await prisma.shippingAddress.findFirst({
    where: {
      userId: users[0].id,
    },
  });

  if (!shippingAddress) {
    // Tạo shipping address mẫu
    const ward = await prisma.ward.findFirst();

    if (!ward) {
      console.log('⚠️  No address data found. Please seed address data first.');
      return;
    }

    shippingAddress = await prisma.shippingAddress.create({
      data: {
        userId: users[0].id,
        fullName: 'Demo Customer',
        phoneNumber: '0123456789',
        homeNumber: '123',
        wardCode: ward.wardCode,
        moreDetail: 'Demo Street',
        isDefault: true,
      },
    });
  }

  // Tạo đơn hàng cho 12 tháng gần đây
  const currentDate = new Date();
  const ordersCreated: number[] = [];

  for (let monthOffset = 12; monthOffset >= 1; monthOffset--) {
    const targetDate = new Date(currentDate);
    targetDate.setMonth(targetDate.getMonth() - monthOffset);

    const month = targetDate.getMonth() + 1;
    const year = targetDate.getFullYear();

    // Số đơn hàng tăng dần theo thời gian (15-40 đơn/tháng)
    const baseOrders = 15;
    const growthFactor = (12 - monthOffset) * 2;
    const numberOfOrders =
      baseOrders + growthFactor + Math.floor(Math.random() * 5);

    console.log(
      `  📅 Creating ${numberOfOrders} orders for ${month}/${year}...`,
    );

    for (let i = 0; i < numberOfOrders; i++) {
      // Random ngày trong tháng
      const dayOfMonth = Math.floor(Math.random() * 28) + 1;
      const orderDate = new Date(year, month - 1, dayOfMonth);
      const completedDate = new Date(orderDate);
      completedDate.setDate(
        completedDate.getDate() + Math.floor(Math.random() * 5) + 2,
      );

      // Random user
      const user = users[Math.floor(Math.random() * users.length)];

      // Tạo đơn hàng
      const order = await prisma.order.create({
        data: {
          userId: user.id,
          shippingAddressId: shippingAddress.id,
          status: OrderStatus.COMPLETED,
          shippingFee: 30000,
          createdAt: orderDate,
          completedAt: completedDate,
          paidAt: orderDate,
          confirmedAt: new Date(orderDate.getTime() + 3600000), // +1 hour
          deliveredAt: completedDate,
        },
      });

      // Số sản phẩm trong đơn hàng (1-5 items)
      const numberOfItems = Math.floor(Math.random() * 4) + 1;

      for (let j = 0; j < numberOfItems; j++) {
        const productDetail =
          productDetails[Math.floor(Math.random() * productDetails.length)];
        const quantity = Math.floor(Math.random() * 3) + 1;

        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            productDetailId: productDetail.id,
            quantity: quantity,
            createdAt: orderDate,
            updatedAt: orderDate,
          },
        });
      }

      // Tạo payment
      await prisma.payment.create({
        data: {
          orderId: order.id,
          amount: 0, // Sẽ được tính từ orderItems
          method: ['VNPAY', 'MOMO', 'COD'][Math.floor(Math.random() * 3)],
          status: 'PAID',
          paidAt: orderDate,
          createdAt: orderDate,
          updatedAt: orderDate,
        },
      });

      ordersCreated.push(order.id);
    }
  }

  console.log(`✅ Created ${ordersCreated.length} demo orders successfully!`);

  // Tính toán và hiển thị thống kê
  const stats = await calculateOrderStats();
  console.log('\n📊 Order Statistics:');
  console.log(
    `  Total Revenue: ${stats.totalRevenue.toLocaleString('vi-VN')} VND`,
  );
  console.log(`  Total Orders: ${stats.totalOrders}`);
  console.log(
    `  Average Order Value: ${stats.averageOrderValue.toLocaleString('vi-VN')} VND`,
  );
  console.log(`  Date Range: ${stats.dateRange.from} to ${stats.dateRange.to}`);
}

/**
 * Tính toán thống kê đơn hàng
 */
async function calculateOrderStats() {
  const orders = await prisma.order.findMany({
    where: {
      status: {
        in: [OrderStatus.COMPLETED, OrderStatus.DELIVERED],
      },
    },
    include: {
      orderItems: {
        include: {
          productDetail: true,
        },
      },
    },
    orderBy: {
      completedAt: 'asc',
    },
  });

  let totalRevenue = 0;
  const dates: Date[] = [];

  orders.forEach((order) => {
    const orderRevenue = order.orderItems.reduce((sum, item) => {
      return sum + item.productDetail.price * item.quantity;
    }, 0);
    totalRevenue += orderRevenue;

    if (order.completedAt) {
      dates.push(order.completedAt);
    }
  });

  return {
    totalRevenue,
    totalOrders: orders.length,
    averageOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0,
    dateRange: {
      from: dates.length > 0 ? dates[0].toLocaleDateString('vi-VN') : 'N/A',
      to:
        dates.length > 0
          ? dates[dates.length - 1].toLocaleDateString('vi-VN')
          : 'N/A',
    },
  };
}

/**
 * Xóa tất cả đơn hàng demo
 */
export async function clearDemoOrders() {
  console.log('🗑️  Clearing demo orders...');

  await prisma.$transaction([
    prisma.payment.deleteMany(),
    prisma.orderItem.deleteMany(),
    prisma.order.deleteMany(),
  ]);

  console.log('✅ Cleared all demo orders');
}
