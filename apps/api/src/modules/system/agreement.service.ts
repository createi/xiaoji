import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AgreementService {
  constructor(private prisma: PrismaService) {}

  /**
   * 获取协议列表
   */
  async getList(params: { page?: number; limit?: number; title?: string }) {
    const { page = 1, limit = 10, title } = params;
    const where: any = {};

    if (title) {
      where.title = { contains: title };
    }

    const [list, total] = await Promise.all([
      this.prisma.systemAgreement.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: 'desc' },
      }),
      this.prisma.systemAgreement.count({ where }),
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
   * 获取协议详情
   */
  async getDetail(id: number) {
    const agreement = await this.prisma.systemAgreement.findUnique({
      where: { id },
    });
    if (!agreement) {
      throw new NotFoundException('协议不存在');
    }
    return {
      ...agreement,
      addTime: Number(agreement.addTime),
    };
  }

  /**
   * 创建协议
   */
  async create(data: { title: string; content: string; status?: number }) {
    return this.prisma.systemAgreement.create({
      data: {
        title: data.title,
        content: data.content,
        status: data.status ?? 1,
        addTime: BigInt(Date.now()),
      },
    });
  }

  /**
   * 更新协议
   */
  async update(
    id: number,
    data: { title?: string; content?: string; status?: number },
  ) {
    const agreement = await this.prisma.systemAgreement.findUnique({
      where: { id },
    });
    if (!agreement) {
      throw new NotFoundException('协议不存在');
    }

    return this.prisma.systemAgreement.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.content !== undefined && { content: data.content }),
        ...(data.status !== undefined && { status: data.status }),
      },
    });
  }

  /**
   * 删除协议
   */
  async delete(id: number) {
    const agreement = await this.prisma.systemAgreement.findUnique({
      where: { id },
    });
    if (!agreement) {
      throw new NotFoundException('协议不存在');
    }

    return this.prisma.systemAgreement.delete({ where: { id } });
  }
}
