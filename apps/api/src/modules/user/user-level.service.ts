import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserLevelDto, UpdateUserLevelDto } from './dto/user.dto';

@Injectable()
export class UserLevelService {
  constructor(private prisma: PrismaService) {}

  async getList(params: { page?: number; limit?: number; name?: string }) {
    const { page = 1, limit = 10, name } = params;
    const where: any = {};

    if (name) {
      where.name = { contains: name };
    }

    const [list, total] = await Promise.all([
      this.prisma.userLevel.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: 'asc' },
      }),
      this.prisma.userLevel.count({ where }),
    ]);

    return { data: list, total, page, limit };
  }

  async getAll() {
    return this.prisma.userLevel.findMany({
      where: { status: 1 },
      orderBy: { grade: 'asc' },
    });
  }

  async getDetail(id: number) {
    const level = await this.prisma.userLevel.findUnique({ where: { id } });
    if (!level) throw new NotFoundException('等级不存在');
    return level;
  }

  async create(data: CreateUserLevelDto) {
    return this.prisma.userLevel.create({
      data: {
        name: data.name,
        image: data.image || '',
        grade: data.grade,
        oneBrokeragePercent: data.one_brokerage_percent || 0,
        twoBrokeragePercent: data.two_brokerage_percent || 0,
        taskTotalNum: data.task_total_num || 0,
        taskNum: 0,
        status: data.status ?? 1,
        isSpecial: 0,
        addTime: BigInt(Date.now()),
      },
    });
  }

  async update(id: number, data: UpdateUserLevelDto) {
    const level = await this.prisma.userLevel.findUnique({ where: { id } });
    if (!level) throw new NotFoundException('等级不存在');

    return this.prisma.userLevel.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.image !== undefined && { image: data.image }),
        ...(data.grade !== undefined && { grade: data.grade }),
        ...(data.one_brokerage_percent !== undefined && { oneBrokeragePercent: data.one_brokerage_percent }),
        ...(data.two_brokerage_percent !== undefined && { twoBrokeragePercent: data.two_brokerage_percent }),
        ...(data.task_total_num !== undefined && { taskTotalNum: data.task_total_num }),
        ...(data.status !== undefined && { status: data.status }),
      },
    });
  }

  async delete(id: number) {
    const level = await this.prisma.userLevel.findUnique({ where: { id } });
    if (!level) throw new NotFoundException('等级不存在');
    return this.prisma.userLevel.delete({ where: { id } });
  }
}
