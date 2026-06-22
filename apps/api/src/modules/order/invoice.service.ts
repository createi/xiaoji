import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class InvoiceService {
  constructor(private prisma: PrismaService) {}

  async getList(query: { page?: number; limit?: number; keyword?: string }) {
    const { page = 1, limit = 10, keyword } = query;
    const where: any = {};

    if (keyword) {
      where.OR = [
        { orderId: { contains: keyword } },
        { title: { contains: keyword } },
        { taxNo: { contains: keyword } },
      ];
    }

    const [list, total] = await Promise.all([
      this.prisma.storeOrderInvoice.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: 'desc' },
      }),
      this.prisma.storeOrderInvoice.count({ where }),
    ]);

    return { data: list, total, page, limit };
  }

  async getDetail(id: number) {
    const item = await this.prisma.storeOrderInvoice.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException('发票记录不存在');
    }
    return item;
  }
}
