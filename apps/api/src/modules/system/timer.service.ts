import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TimerService {
  constructor(private prisma: PrismaService) {}

  async getList(params: { page?: number; limit?: number }) {
    const { page = 1, limit = 10 } = params;

    const [list, total] = await Promise.all([
      this.prisma.systemTimer.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { addTime: 'desc' },
      }),
      this.prisma.systemTimer.count(),
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
    command: string;
    cron: string;
    status?: number;
    remark?: string;
  }) {
    const result = await this.prisma.systemTimer.create({
      data: {
        name: data.name,
        command: data.command,
        cron: data.cron,
        status: data.status ?? 1,
        remark: data.remark || '',
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
      command?: string;
      cron?: string;
      status?: number;
      remark?: string;
    },
  ) {
    const timer = await this.prisma.systemTimer.findUnique({
      where: { id },
    });
    if (!timer) {
      throw new NotFoundException('定时任务不存在');
    }

    const result = await this.prisma.systemTimer.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.command !== undefined && { command: data.command }),
        ...(data.cron !== undefined && { cron: data.cron }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.remark !== undefined && { remark: data.remark }),
      },
    });

    return {
      ...result,
      id: Number(result.id),
      addTime: Number(result.addTime),
    };
  }

  async delete(id: number) {
    const timer = await this.prisma.systemTimer.findUnique({
      where: { id },
    });
    if (!timer) {
      throw new NotFoundException('定时任务不存在');
    }

    return this.prisma.systemTimer.delete({ where: { id } });
  }
}
