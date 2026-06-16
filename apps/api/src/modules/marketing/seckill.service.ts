import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSeckillDto, UpdateSeckillDto } from './dto/seckill.dto';

@Injectable()
export class SeckillService {
  constructor(private prisma: PrismaService) {}

  async getList(query: { page?: number; limit?: number; title?: string; status?: number }) {
    const { page = 1, limit = 10, title, status } = query;
    const where: any = {};

    if (title) {
      where.title = { contains: title };
    }
    if (status !== undefined) {
      where.status = status;
    }

    const [list, total] = await Promise.all([
      this.prisma.storeSeckill.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: 'desc' },
      }),
      this.prisma.storeSeckill.count({ where }),
    ]);

    return { data: list, total, page, limit };
  }

  async getDetail(id: number) {
    const seckill = await this.prisma.storeSeckill.findUnique({ where: { id } });
    if (!seckill) {
      throw new NotFoundException('秒杀活动不存在');
    }
    return seckill;
  }

  async create(data: CreateSeckillDto) {
    return this.prisma.storeSeckill.create({
      data: {
        title: data.title,
        activityName: data.activity_name || '',
        productId: data.product_id,
        price: data.price,
        stock: data.stock,
        quota: data.quota || 0,
        total: data.stock,
        startTime: data.start_time,
        endTime: data.end_time,
        sort: data.sort || 0,
        status: 1,
        addTime: BigInt(Date.now()),
      },
    });
  }

  async update(id: number, data: UpdateSeckillDto) {
    const seckill = await this.prisma.storeSeckill.findUnique({ where: { id } });
    if (!seckill) {
      throw new NotFoundException('秒杀活动不存在');
    }

    return this.prisma.storeSeckill.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.activity_name !== undefined && { activityName: data.activity_name }),
        ...(data.product_id !== undefined && { productId: data.product_id }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.stock !== undefined && { stock: data.stock }),
        ...(data.quota !== undefined && { quota: data.quota }),
        ...(data.start_time !== undefined && { startTime: data.start_time }),
        ...(data.end_time !== undefined && { endTime: data.end_time }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.sort !== undefined && { sort: data.sort }),
      },
    });
  }

  async delete(id: number) {
    const seckill = await this.prisma.storeSeckill.findUnique({ where: { id } });
    if (!seckill) {
      throw new NotFoundException('秒杀活动不存在');
    }
    return this.prisma.storeSeckill.delete({ where: { id } });
  }
}
