import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTemplateDto, UpdateTemplateDto } from './dto/shipping.dto';

@Injectable()
export class TemplateService {
  constructor(private prisma: PrismaService) {}

  async getList(query: { page?: number; limit?: number }) {
    const { page = 1, limit = 10 } = query;

    const [list, total] = await Promise.all([
      this.prisma.shippingTemplate.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { sort: 'asc' },
      }),
      this.prisma.shippingTemplate.count(),
    ]);

    return { data: list, total, page, limit };
  }

  async getDetail(id: number) {
    const template = await this.prisma.shippingTemplate.findUnique({ where: { id } });
    if (!template) {
      throw new NotFoundException('运费模板不存在');
    }
    return template;
  }

  async create(data: CreateTemplateDto) {
    return this.prisma.shippingTemplate.create({
      data: {
        name: data.name,
        type: data.type,
        appoint: data.appoint || 0,
        sort: data.sort || 0,
        addTime: BigInt(Date.now()),
      },
    });
  }

  async update(id: number, data: UpdateTemplateDto) {
    const template = await this.prisma.shippingTemplate.findUnique({ where: { id } });
    if (!template) {
      throw new NotFoundException('运费模板不存在');
    }

    return this.prisma.shippingTemplate.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.type !== undefined && { type: data.type }),
        ...(data.appoint !== undefined && { appoint: data.appoint }),
        ...(data.sort !== undefined && { sort: data.sort }),
      },
    });
  }

  async delete(id: number) {
    const template = await this.prisma.shippingTemplate.findUnique({ where: { id } });
    if (!template) {
      throw new NotFoundException('运费模板不存在');
    }
    return this.prisma.shippingTemplate.delete({ where: { id } });
  }
}
