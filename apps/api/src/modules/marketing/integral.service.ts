import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateIntegralDto, UpdateIntegralDto } from './dto/integral.dto';

@Injectable()
export class IntegralService {
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
      this.prisma.storeIntegral.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: 'desc' },
      }),
      this.prisma.storeIntegral.count({ where }),
    ]);

    return { data: list, total, page, limit };
  }

  async getDetail(id: number) {
    const integral = await this.prisma.storeIntegral.findUnique({ where: { id } });
    if (!integral) {
      throw new NotFoundException('积分商品不存在');
    }
    return integral;
  }

  async create(data: CreateIntegralDto) {
    return this.prisma.storeIntegral.create({
      data: {
        title: data.title,
        image: data.image || '',
        productId: data.product_id,
        price: data.price,
        costPrice: 0,
        vipPrice: 0,
        stock: data.total,
        quota: data.quota || 0,
        total: data.total,
        sales: 0,
        sort: data.sort || 0,
        status: data.status ?? 1,
        addTime: BigInt(Date.now()),
      },
    });
  }

  async update(id: number, data: UpdateIntegralDto) {
    const integral = await this.prisma.storeIntegral.findUnique({ where: { id } });
    if (!integral) {
      throw new NotFoundException('积分商品不存在');
    }

    return this.prisma.storeIntegral.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.image !== undefined && { image: data.image }),
        ...(data.product_id !== undefined && { productId: data.product_id }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.total !== undefined && { total: data.total }),
        ...(data.quota !== undefined && { quota: data.quota }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.sort !== undefined && { sort: data.sort }),
      },
    });
  }

  async delete(id: number) {
    const integral = await this.prisma.storeIntegral.findUnique({ where: { id } });
    if (!integral) {
      throw new NotFoundException('积分商品不存在');
    }
    return this.prisma.storeIntegral.delete({ where: { id } });
  }
}
