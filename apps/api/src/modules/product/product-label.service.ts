import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductLabelDto, UpdateProductLabelDto } from './dto/product.dto';

@Injectable()
export class ProductLabelService {
  constructor(private prisma: PrismaService) {}

  async getList(params: { page?: number; limit?: number; name?: string }) {
    const { page = 1, limit = 10, name } = params;
    const where: any = {};

    if (name) {
      where.name = { contains: name };
    }

    const [list, total] = await Promise.all([
      this.prisma.storeProductLabel.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { sort: 'asc' },
      }),
      this.prisma.storeProductLabel.count({ where }),
    ]);

    return { data: list, total, page, limit };
  }

  async getAll() {
    return this.prisma.storeProductLabel.findMany({
      where: { status: 1 },
      orderBy: { sort: 'asc' },
    });
  }

  async getDetail(id: number) {
    const label = await this.prisma.storeProductLabel.findUnique({ where: { id } });
    if (!label) throw new NotFoundException('标签不存在');
    return label;
  }

  async create(data: CreateProductLabelDto) {
    return this.prisma.storeProductLabel.create({
      data: {
        name: data.name,
        sort: data.sort || 0,
        status: data.status ?? 1,
        addTime: BigInt(Date.now()),
      },
    });
  }

  async update(id: number, data: UpdateProductLabelDto) {
    const label = await this.prisma.storeProductLabel.findUnique({ where: { id } });
    if (!label) throw new NotFoundException('标签不存在');

    return this.prisma.storeProductLabel.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.sort !== undefined && { sort: data.sort }),
        ...(data.status !== undefined && { status: data.status }),
      },
    });
  }

  async delete(id: number) {
    const label = await this.prisma.storeProductLabel.findUnique({ where: { id } });
    if (!label) throw new NotFoundException('标签不存在');
    return this.prisma.storeProductLabel.delete({ where: { id } });
  }
}
