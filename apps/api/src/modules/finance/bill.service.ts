import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryBillDto } from './dto/finance.dto';

@Injectable()
export class BillService {
  constructor(private prisma: PrismaService) {}

  async getList(query: QueryBillDto) {
    const { page = 1, limit = 10, type, start_time, end_time } = query;
    const where: any = {};

    if (type !== undefined) {
      where.type = type;
    }

    if (start_time || end_time) {
      where.addTime = {};
      if (start_time) where.addTime.gte = BigInt(new Date(start_time).getTime());
      if (end_time) where.addTime.lte = BigInt(new Date(end_time).getTime());
    }

    const [list, total] = await Promise.all([
      this.prisma.userBill.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: 'desc' },
      }),
      this.prisma.userBill.count({ where }),
    ]);

    return { data: list, total, page, limit };
  }

  async getDetail(id: number) {
    return this.prisma.userBill.findUnique({ where: { id } });
  }
}
