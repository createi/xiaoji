import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CommissionService {
  constructor(private prisma: PrismaService) {}

  async getList(query: { page?: number; limit?: number; keyword?: string }) {
    const { page = 1, limit = 10, keyword } = query;
    const where: any = {
      brokeragePrice: { gt: 0 },
    };

    if (keyword) {
      where.OR = [
        { account: { contains: keyword } },
        { realName: { contains: keyword } },
        { phone: { contains: keyword } },
      ];
    }

    const [list, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { brokeragePrice: 'desc' },
        select: {
          uid: true,
          account: true,
          realName: true,
          phone: true,
          nickname: true,
          brokeragePrice: true,
          addTime: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: list.map((item) => ({
        ...item,
        brokeragePrice: Number(item.brokeragePrice),
      })),
      total,
      page,
      limit,
    };
  }
}
