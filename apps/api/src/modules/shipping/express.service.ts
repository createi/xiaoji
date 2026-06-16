import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateExpressDto, UpdateExpressDto } from './dto/shipping.dto';

@Injectable()
export class ExpressService {
  constructor(private prisma: PrismaService) {}

  async getList(query: { page?: number; limit?: number }) {
    const { page = 1, limit = 10 } = query;

    const [list, total] = await Promise.all([
      this.prisma.express.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { sort: 'asc' },
      }),
      this.prisma.express.count(),
    ]);

    return { data: list, total, page, limit };
  }

  async getAll() {
    return this.prisma.express.findMany({
      where: { isShow: 1 },
      orderBy: { sort: 'asc' },
    });
  }

  async getDetail(id: number) {
    const express = await this.prisma.express.findUnique({ where: { id } });
    if (!express) {
      throw new NotFoundException('快递公司不存在');
    }
    return express;
  }

  async create(data: CreateExpressDto) {
    return this.prisma.express.create({
      data: {
        name: data.name,
        code: data.code,
        url: data.url || '',
        sort: data.sort || 0,
        isShow: data.is_show ?? 1,
        addTime: BigInt(Date.now()),
      },
    });
  }

  async update(id: number, data: UpdateExpressDto) {
    const express = await this.prisma.express.findUnique({ where: { id } });
    if (!express) {
      throw new NotFoundException('快递公司不存在');
    }

    return this.prisma.express.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.code !== undefined && { code: data.code }),
        ...(data.url !== undefined && { url: data.url }),
        ...(data.sort !== undefined && { sort: data.sort }),
        ...(data.is_show !== undefined && { isShow: data.is_show }),
      },
    });
  }

  async delete(id: number) {
    const express = await this.prisma.express.findUnique({ where: { id } });
    if (!express) {
      throw new NotFoundException('快递公司不存在');
    }
    return this.prisma.express.delete({ where: { id } });
  }
}
