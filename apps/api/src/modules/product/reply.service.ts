import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReplyService {
  constructor(private prisma: PrismaService) {}

  async getList(params: {
    page?: number;
    limit?: number;
    product_id?: number;
    status?: number;
  }) {
    const { page = 1, limit = 10, product_id, status } = params;
    const where: any = {};

    if (product_id) {
      where.productId = product_id;
    }
    if (status !== undefined) {
      where.status = status;
    }

    const [list, total] = await Promise.all([
      this.prisma.storeProductReply.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { addTime: 'desc' },
      }),
      this.prisma.storeProductReply.count({ where }),
    ]);

    return { data: list, total, page, limit };
  }

  async reply(id: number, reply: string) {
    const replyRecord = await this.prisma.storeProductReply.findUnique({ where: { id } });
    if (!replyRecord) throw new NotFoundException('评价不存在');

    return this.prisma.storeProductReply.update({
      where: { id },
      data: {
        reply,
        isReply: 1,
        replyTime: BigInt(Date.now()),
      },
    });
  }

  async delete(id: number) {
    const replyRecord = await this.prisma.storeProductReply.findUnique({ where: { id } });
    if (!replyRecord) throw new NotFoundException('评价不存在');
    return this.prisma.storeProductReply.delete({ where: { id } });
  }
}
