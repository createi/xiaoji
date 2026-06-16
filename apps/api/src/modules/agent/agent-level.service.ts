import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAgentLevelDto, UpdateAgentLevelDto } from './dto/agent.dto';

@Injectable()
export class AgentLevelService {
  constructor(private prisma: PrismaService) {}

  async getList(query: { page?: number; limit?: number }) {
    const { page = 1, limit = 10 } = query;

    const [list, total] = await Promise.all([
      this.prisma.agentLevel.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { sort: 'asc' },
      }),
      this.prisma.agentLevel.count(),
    ]);

    return { data: list, total, page, limit };
  }

  async getAll() {
    return this.prisma.agentLevel.findMany({
      where: { status: 1 },
      orderBy: { sort: 'asc' },
    });
  }

  async getDetail(id: number) {
    const level = await this.prisma.agentLevel.findUnique({ where: { id } });
    if (!level) {
      throw new NotFoundException('分销等级不存在');
    }
    return level;
  }

  async create(data: CreateAgentLevelDto) {
    return this.prisma.agentLevel.create({
      data: {
        name: data.name,
        image: data.image || '',
        oneBrokerage: data.one_brokerage,
        twoBrokerage: data.two_brokerage,
        sort: data.sort || 0,
        status: data.status ?? 1,
        addTime: BigInt(Date.now()),
      },
    });
  }

  async update(id: number, data: UpdateAgentLevelDto) {
    const level = await this.prisma.agentLevel.findUnique({ where: { id } });
    if (!level) {
      throw new NotFoundException('分销等级不存在');
    }

    return this.prisma.agentLevel.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.image !== undefined && { image: data.image }),
        ...(data.one_brokerage !== undefined && { oneBrokerage: data.one_brokerage }),
        ...(data.two_brokerage !== undefined && { twoBrokerage: data.two_brokerage }),
        ...(data.sort !== undefined && { sort: data.sort }),
        ...(data.status !== undefined && { status: data.status }),
      },
    });
  }

  async delete(id: number) {
    const level = await this.prisma.agentLevel.findUnique({ where: { id } });
    if (!level) {
      throw new NotFoundException('分销等级不存在');
    }
    return this.prisma.agentLevel.delete({ where: { id } });
  }
}
