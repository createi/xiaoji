import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RefundService {
  constructor(private prisma: PrismaService) {}

  async getList(query: { page?: number; limit?: number; status?: number; keyword?: string }) {
    const { page = 1, limit = 10, status, keyword } = query;
    const where: any = {};

    if (status !== undefined) {
      where.status = status;
    }

    if (keyword) {
      where.OR = [
        { orderId: { contains: keyword } },
        { refundOrderId: { contains: keyword } },
      ];
    }

    const [list, total] = await Promise.all([
      this.prisma.storeOrderRefund.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: 'desc' },
        include: { order: true },
      }),
      this.prisma.storeOrderRefund.count({ where }),
    ]);

    return {
      data: list.map((item) => ({
        ...item,
        refundPrice: Number(item.refundPrice),
      })),
      total,
      page,
      limit,
    };
  }

  async getDetail(id: number) {
    const item = await this.prisma.storeOrderRefund.findUnique({
      where: { id },
      include: { order: true },
    });
    if (!item) {
      throw new NotFoundException('退款记录不存在');
    }
    return {
      ...item,
      refundPrice: Number(item.refundPrice),
    };
  }

  async audit(id: number, data: { status: number; mark?: string }) {
    const item = await this.prisma.storeOrderRefund.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException('退款记录不存在');
    }

    if (item.status !== 0) {
      throw new BadRequestException('该退款记录已处理');
    }

    return this.prisma.storeOrderRefund.update({
      where: { id },
      data: {
        status: data.status,
        refundTime: BigInt(Date.now()),
      },
    });
  }
}
