import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DiyService {
  constructor(private prisma: PrismaService) {}

  /**
   * 获取DIY列表
   */
  async getList(params: { page?: number; limit?: number; name?: string }) {
    const { page = 1, limit = 10, name } = params;
    const where: any = {};

    if (name) {
      where.name = { contains: name };
    }

    const [list, total] = await Promise.all([
      this.prisma.diy.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: 'desc' },
      }),
      this.prisma.diy.count({ where }),
    ]);

    return {
      data: list.map((item) => ({
        ...item,
        addTime: Number(item.addTime),
      })),
      total,
      page,
      limit,
    };
  }

  /**
   * 获取DIY详情
   */
  async getDetail(id: number) {
    const diy = await this.prisma.diy.findUnique({ where: { id } });
    if (!diy) {
      throw new NotFoundException('DIY不存在');
    }
    return {
      ...diy,
      addTime: Number(diy.addTime),
    };
  }

  /**
   * 创建DIY
   */
  async create(data: {
    name: string;
    description?: string;
    content?: string;
    isDefault?: number;
    status?: number;
  }) {
    return this.prisma.diy.create({
      data: {
        name: data.name,
        description: data.description || '',
        content: data.content || '',
        isDefault: data.isDefault ?? 0,
        status: data.status ?? 1,
        addTime: BigInt(Date.now()),
      },
    });
  }

  /**
   * 更新DIY
   */
  async update(
    id: number,
    data: {
      name?: string;
      description?: string;
      content?: string;
      isDefault?: number;
      status?: number;
    },
  ) {
    const diy = await this.prisma.diy.findUnique({ where: { id } });
    if (!diy) {
      throw new NotFoundException('DIY不存在');
    }

    return this.prisma.diy.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.content !== undefined && { content: data.content }),
        ...(data.isDefault !== undefined && { isDefault: data.isDefault }),
        ...(data.status !== undefined && { status: data.status }),
      },
    });
  }

  /**
   * 删除DIY
   */
  async delete(id: number) {
    const diy = await this.prisma.diy.findUnique({ where: { id } });
    if (!diy) {
      throw new NotFoundException('DIY不存在');
    }

    return this.prisma.diy.delete({ where: { id } });
  }
}
