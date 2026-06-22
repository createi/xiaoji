import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AttributeService {
  constructor(private prisma: PrismaService) {}

  async getList(params: { page?: number; limit?: number }) {
    const { page = 1, limit = 10 } = params;

    const [list, total] = await Promise.all([
      this.prisma.storeProductAttrResult.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { sort: 'asc' },
      }),
      this.prisma.storeProductAttrResult.count(),
    ]);

    return {
      data: list.map((item) => ({
        ...item,
        id: Number(item.id),
        productId: Number(item.productId),
        sort: Number(item.sort),
      })),
      total,
      page,
      limit,
    };
  }

  async create(data: {
    productId: number;
    valueName: string;
    resultType?: string;
    sort?: number;
    image?: string;
  }) {
    const result = await this.prisma.storeProductAttrResult.create({
      data: {
        productId: data.productId,
        valueName: data.valueName,
        resultType: data.resultType || '',
        sort: data.sort || 0,
        image: data.image || '',
      },
    });

    return {
      ...result,
      id: Number(result.id),
      productId: Number(result.productId),
      sort: Number(result.sort),
    };
  }

  async update(
    id: number,
    data: {
      productId?: number;
      valueName?: string;
      resultType?: string;
      sort?: number;
      image?: string;
    },
  ) {
    const attr = await this.prisma.storeProductAttrResult.findUnique({
      where: { id },
    });
    if (!attr) {
      throw new NotFoundException('属性不存在');
    }

    const result = await this.prisma.storeProductAttrResult.update({
      where: { id },
      data: {
        ...(data.productId !== undefined && { productId: data.productId }),
        ...(data.valueName !== undefined && { valueName: data.valueName }),
        ...(data.resultType !== undefined && { resultType: data.resultType }),
        ...(data.sort !== undefined && { sort: data.sort }),
        ...(data.image !== undefined && { image: data.image }),
      },
    });

    return {
      ...result,
      id: Number(result.id),
      productId: Number(result.productId),
      sort: Number(result.sort),
    };
  }

  async delete(id: number) {
    const attr = await this.prisma.storeProductAttrResult.findUnique({
      where: { id },
    });
    if (!attr) {
      throw new NotFoundException('属性不存在');
    }

    return this.prisma.storeProductAttrResult.delete({ where: { id } });
  }
}
