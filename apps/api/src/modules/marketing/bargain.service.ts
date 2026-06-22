import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBargainDto, UpdateBargainDto } from './dto/bargain.dto';

@Injectable()
export class BargainService {
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
      this.prisma.storeBargain.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: 'desc' },
      }),
      this.prisma.storeBargain.count({ where }),
    ]);

    return { data: list, total, page, limit };
  }

  async getDetail(id: number) {
    const bargain = await this.prisma.storeBargain.findUnique({ where: { id } });
    if (!bargain) {
      throw new NotFoundException('砍价活动不存在');
    }
    return bargain;
  }

  async create(data: CreateBargainDto) {
    return this.prisma.storeBargain.create({
      data: {
        title: data.title,
        image: data.image || '',
        productId: data.product_id,
        price: data.price,
        costPrice: 0,
        productPrice: data.product_price,
        minPrice: data.min_price,
        bargainStock: data.bargain_stock,
        quota: data.quota || 0,
        total: data.bargain_stock,
        sort: data.sort || 0,
        status: data.status ?? 1,
        startTime: data.start_time ? BigInt(Math.floor(new Date(data.start_time).getTime() / 1000)) : BigInt(0),
        endTime: data.end_time ? BigInt(Math.floor(new Date(data.end_time).getTime() / 1000)) : BigInt(0),
        rule: data.rule || '',
        addTime: BigInt(Date.now()),
        countPeopleAll: 0,
        countPeopleHelp: 0,
        countPeopleSuccess: 0,
      },
    });
  }

  async update(id: number, data: UpdateBargainDto) {
    const bargain = await this.prisma.storeBargain.findUnique({ where: { id } });
    if (!bargain) {
      throw new NotFoundException('砍价活动不存在');
    }

    return this.prisma.storeBargain.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.image !== undefined && { image: data.image }),
        ...(data.product_id !== undefined && { productId: data.product_id }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.product_price !== undefined && { productPrice: data.product_price }),
        ...(data.min_price !== undefined && { minPrice: data.min_price }),
        ...(data.bargain_stock !== undefined && { bargainStock: data.bargain_stock }),
        ...(data.quota !== undefined && { quota: data.quota }),
        ...(data.start_time !== undefined && { startTime: data.start_time ? BigInt(Math.floor(new Date(data.start_time).getTime() / 1000)) : BigInt(0) }),
        ...(data.end_time !== undefined && { endTime: data.end_time ? BigInt(Math.floor(new Date(data.end_time).getTime() / 1000)) : BigInt(0) }),
        ...(data.rule !== undefined && { rule: data.rule }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.sort !== undefined && { sort: data.sort }),
      },
    });
  }

  async delete(id: number) {
    const bargain = await this.prisma.storeBargain.findUnique({ where: { id } });
    if (!bargain) {
      throw new NotFoundException('砍价活动不存在');
    }
    return this.prisma.storeBargain.delete({ where: { id } });
  }
}
