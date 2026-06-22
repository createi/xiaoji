import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SignService {
  constructor(private prisma: PrismaService) {}

  async getConfig() {
    const list = await this.prisma.systemSignReward.findMany({
      orderBy: { day: 'asc' },
    });
    return list;
  }

  async updateConfig(data: Array<{ id?: number; day: number; number: number; type: number; status: number; sort: number }>) {
    const results = [];

    for (const item of data) {
      if (item.id) {
        const updated = await this.prisma.systemSignReward.update({
          where: { id: item.id },
          data: {
            day: item.day,
            number: item.number,
            type: item.type,
            status: item.status,
            sort: item.sort,
          },
        });
        results.push(updated);
      } else {
        const created = await this.prisma.systemSignReward.create({
          data: {
            day: item.day,
            number: item.number,
            type: item.type,
            status: item.status,
            sort: item.sort,
          },
        });
        results.push(created);
      }
    }

    return results;
  }

  async delete(id: number) {
    const item = await this.prisma.systemSignReward.findUnique({ where: { id } });
    if (!item) {
      return null;
    }
    return this.prisma.systemSignReward.delete({ where: { id } });
  }
}
