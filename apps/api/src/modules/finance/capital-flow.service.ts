import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CapitalFlowService {
  constructor(private prisma: PrismaService) {}

  async getList(query: { page?: number; limit?: number; type?: number; keyword?: string }) {
    const { page = 1, limit = 10, type, keyword } = query;
    const where: any = {};

    if (type !== undefined) {
      where.type = type;
    }

    if (keyword) {
      where.OR = [
        { nickname: { contains: keyword } },
        { mark: { contains: keyword } },
      ];
    }

    const [list, total] = await Promise.all([
      this.prisma.capitalFlow.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: 'desc' },
      }),
      this.prisma.capitalFlow.count({ where }),
    ]);

    return {
      data: list.map((item) => ({
        ...item,
        number: Number(item.number),
        balance: Number(item.balance),
      })),
      total,
      page,
      limit,
    };
  }

  async getDetail(id: number) {
    const item = await this.prisma.capitalFlow.findUnique({ where: { id } });
    if (!item) {
      return null;
    }
    return {
      ...item,
      number: Number(item.number),
      balance: Number(item.balance),
    };
  }
}
