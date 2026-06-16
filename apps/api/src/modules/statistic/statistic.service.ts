import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StatisticService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterdayStart = todayStart - 24 * 60 * 60 * 1000;

    // 今日订单统计
    const todayOrders = await this.prisma.storeOrder.findMany({
      where: {
        addTime: { gte: BigInt(todayStart) },
        isDel: 0,
      },
    });

    // 昨日订单统计
    const yesterdayOrders = await this.prisma.storeOrder.findMany({
      where: {
        addTime: { gte: BigInt(yesterdayStart), lt: BigInt(todayStart) },
        isDel: 0,
      },
    });

    // 今日销售额
    const todaySales = todayOrders.reduce((sum, order) => sum + Number(order.payPrice), 0);
    // 昨日销售额
    const yesterdaySales = yesterdayOrders.reduce((sum, order) => sum + Number(order.payPrice), 0);

    // 用户统计
    const totalUsers = await this.prisma.user.count();
    const todayUsers = await this.prisma.user.count({
      where: { addTime: { gte: BigInt(todayStart) } },
    });

    // 商品统计
    const totalProducts = await this.prisma.storeProduct.count({
      where: { isDel: 0 },
    });

    return {
      todaySales,
      yesterdaySales,
      salesGrowth: yesterdaySales > 0
        ? ((todaySales - yesterdaySales) / yesterdaySales * 100).toFixed(2)
        : '0',
      totalSales: todaySales, // 简化处理
      todayOrders: todayOrders.length,
      yesterdayOrders: yesterdayOrders.length,
      orderGrowth: yesterdayOrders.length > 0
        ? ((todayOrders.length - yesterdayOrders.length) / yesterdayOrders.length * 100).toFixed(2)
        : '0',
      totalOrders: todayOrders.length,
      totalUsers,
      todayUsers,
      totalProducts,
    };
  }

  async getTransactionStatistics(params: { type?: string }) {
    const { type = 'day' } = params;
    const now = new Date();
    const results: any[] = [];

    // 根据类型生成统计数据
    if (type === 'day') {
      // 最近7天
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
        const dayEnd = dayStart + 24 * 60 * 60 * 1000;

        const orders = await this.prisma.storeOrder.findMany({
          where: {
            addTime: { gte: BigInt(dayStart), lt: BigInt(dayEnd) },
            isDel: 0,
          },
        });

        results.push({
          date: `${date.getMonth() + 1}/${date.getDate()}`,
          count: orders.length,
          amount: orders.reduce((sum, o) => sum + Number(o.payPrice), 0),
        });
      }
    }

    return results;
  }

  async getProductStatistics() {
    const products = await this.prisma.storeProduct.findMany({
      where: { isDel: 0 },
      orderBy: { sales: 'desc' },
      take: 10,
    });

    return {
      topProducts: products.map(p => ({
        id: p.id,
        name: p.storeName,
        image: p.image,
        sales: p.sales,
        price: p.price,
      })),
    };
  }

  async getUserStatistics() {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    const totalUsers = await this.prisma.user.count();
    const todayUsers = await this.prisma.user.count({
      where: { addTime: { gte: BigInt(todayStart) } },
    });

    // 性别分布
    const maleUsers = await this.prisma.user.count({ where: { sex: 1 } });
    const femaleUsers = await this.prisma.user.count({ where: { sex: 2 } });
    const unknownSex = totalUsers - maleUsers - femaleUsers;

    return {
      totalUsers,
      todayUsers,
      genderDistribution: {
        male: maleUsers,
        female: femaleUsers,
        unknown: unknownSex,
      },
    };
  }
}
