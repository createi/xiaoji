import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StorageService {
  constructor(private prisma: PrismaService) {}

  async getList(params: { page?: number; limit?: number }) {
    const { page = 1, limit = 10 } = params;

    const [list, total] = await Promise.all([
      this.prisma.systemStorage.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { addTime: 'desc' },
      }),
      this.prisma.systemStorage.count(),
    ]);

    return {
      data: list.map((item) => ({
        ...item,
        id: Number(item.id),
        addTime: Number(item.addTime),
      })),
      total,
      page,
      limit,
    };
  }

  async create(data: {
    name: string;
    bucket?: string;
    endpoint?: string;
    domain?: string;
    region?: string;
  }) {
    const result = await this.prisma.systemStorage.create({
      data: {
        name: data.name,
        bucket: data.bucket || '',
        endpoint: data.endpoint || '',
        domain: data.domain || '',
        region: data.region || '',
        addTime: BigInt(Date.now()),
      },
    });

    return {
      ...result,
      id: Number(result.id),
      addTime: Number(result.addTime),
    };
  }

  async update(
    id: number,
    data: {
      name?: string;
      bucket?: string;
      endpoint?: string;
      domain?: string;
      region?: string;
    },
  ) {
    const storage = await this.prisma.systemStorage.findUnique({
      where: { id },
    });
    if (!storage) {
      throw new NotFoundException('存储配置不存在');
    }

    const result = await this.prisma.systemStorage.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.bucket !== undefined && { bucket: data.bucket }),
        ...(data.endpoint !== undefined && { endpoint: data.endpoint }),
        ...(data.domain !== undefined && { domain: data.domain }),
        ...(data.region !== undefined && { region: data.region }),
      },
    });

    return {
      ...result,
      id: Number(result.id),
      addTime: Number(result.addTime),
    };
  }

  async delete(id: number) {
    const storage = await this.prisma.systemStorage.findUnique({
      where: { id },
    });
    if (!storage) {
      throw new NotFoundException('存储配置不存在');
    }

    return this.prisma.systemStorage.delete({ where: { id } });
  }
}
