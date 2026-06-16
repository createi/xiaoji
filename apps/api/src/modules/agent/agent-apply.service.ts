import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateApplyDto } from './dto/agent.dto';

@Injectable()
export class AgentApplyService {
  constructor(private prisma: PrismaService) {}

  async getList(query: { page?: number; limit?: number; status?: number }) {
    const { page = 1, limit = 10, status } = query;
    const where: any = {};

    if (status !== undefined) {
      where.status = status;
    }

    const [list, total] = await Promise.all([
      this.prisma.divisionAgentApply.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: 'desc' },
      }),
      this.prisma.divisionAgentApply.count({ where }),
    ]);

    return { data: list, total, page, limit };
  }

  async getDetail(id: number) {
    const apply = await this.prisma.divisionAgentApply.findUnique({ where: { id } });
    if (!apply) {
      throw new NotFoundException('分销申请不存在');
    }
    return apply;
  }

  async approve(id: number, data: UpdateApplyDto) {
    const apply = await this.prisma.divisionAgentApply.findUnique({ where: { id } });
    if (!apply) {
      throw new NotFoundException('分销申请不存在');
    }

    if (apply.status !== 0) {
      throw new BadRequestException('该申请已处理');
    }

    // 如果通过，更新用户分销状态
    if (data.status === 1) {
      await this.prisma.user.update({
        where: { uid: apply.uid },
        data: { spreadOpen: 1 },
      });
    }

    return this.prisma.divisionAgentApply.update({
      where: { id },
      data: { status: data.status },
    });
  }

  async reject(id: number, data: UpdateApplyDto) {
    const apply = await this.prisma.divisionAgentApply.findUnique({ where: { id } });
    if (!apply) {
      throw new NotFoundException('分销申请不存在');
    }

    if (apply.status !== 0) {
      throw new BadRequestException('该申请已处理');
    }

    return this.prisma.divisionAgentApply.update({
      where: { id },
      data: { status: 2 },
    });
  }
}
