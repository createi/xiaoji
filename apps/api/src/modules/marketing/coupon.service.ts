import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCouponDto, UpdateCouponDto } from './dto/coupon.dto';

@Injectable()
export class CouponService {
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
      this.prisma.storeCoupon.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: 'desc' },
      }),
      this.prisma.storeCoupon.count({ where }),
    ]);

    return { data: list, total, page, limit };
  }

  async getDetail(id: number) {
    const coupon = await this.prisma.storeCoupon.findUnique({ where: { id } });
    if (!coupon) {
      throw new NotFoundException('优惠券不存在');
    }
    return coupon;
  }

  async create(data: CreateCouponDto) {
    return this.prisma.storeCoupon.create({
      data: {
        title: data.title,
        type: data.type,
        value: data.value,
        minPrice: data.min_price || 0,
        useType: data.use_type || 1,
        categoryIds: data.category_ids || '[]',
        productIds: data.product_ids || '[]',
        startTime: data.start_time ? BigInt(Math.floor(new Date(data.start_time).getTime() / 1000)) : BigInt(0),
        endTime: data.end_time ? BigInt(Math.floor(new Date(data.end_time).getTime() / 1000)) : BigInt(0),
        isShow: 1,
        status: 1,
        sort: 0,
        addTime: BigInt(Date.now()),
      },
    });
  }

  async update(id: number, data: UpdateCouponDto) {
    const coupon = await this.prisma.storeCoupon.findUnique({ where: { id } });
    if (!coupon) {
      throw new NotFoundException('优惠券不存在');
    }

    return this.prisma.storeCoupon.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.type !== undefined && { type: data.type }),
        ...(data.value !== undefined && { value: data.value }),
        ...(data.min_price !== undefined && { minPrice: data.min_price }),
        ...(data.use_type !== undefined && { useType: data.use_type }),
        ...(data.category_ids !== undefined && { categoryIds: data.category_ids }),
        ...(data.product_ids !== undefined && { productIds: data.product_ids }),
        ...(data.start_time !== undefined && { startTime: data.start_time ? BigInt(Math.floor(new Date(data.start_time).getTime() / 1000)) : BigInt(0) }),
        ...(data.end_time !== undefined && { endTime: data.end_time ? BigInt(Math.floor(new Date(data.end_time).getTime() / 1000)) : BigInt(0) }),
        ...(data.status !== undefined && { status: data.status }),
      },
    });
  }

  async delete(id: number) {
    const coupon = await this.prisma.storeCoupon.findUnique({ where: { id } });
    if (!coupon) {
      throw new NotFoundException('优惠券不存在');
    }
    return this.prisma.storeCoupon.delete({ where: { id } });
  }
}
