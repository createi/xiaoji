import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserLabelDto, UpdateUserLabelDto } from './dto/user.dto';

@Injectable()
export class UserLabelService {
  constructor(private prisma: PrismaService) {}

  async getList(params: { page?: number; limit?: number; name?: string }) {
    const { page = 1, limit = 10, name } = params;
    const where: any = {};

    if (name) {
      where.name = { contains: name };
    }

    const [list, total] = await Promise.all([
      this.prisma.userLabel.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { sort: 'asc' },
      }),
      this.prisma.userLabel.count({ where }),
    ]);

    return { data: list, total, page, limit };
  }

  async getAll() {
    return this.prisma.userLabel.findMany({
      where: { status: 1 },
      orderBy: { sort: 'asc' },
    });
  }

  async getDetail(id: number) {
    const label = await this.prisma.userLabel.findUnique({ where: { id } });
    if (!label) throw new NotFoundException('标签不存在');
    return label;
  }

  async create(data: CreateUserLabelDto) {
    return this.prisma.userLabel.create({
      data: {
        name: data.name,
        color: data.color || '#1890ff',
        sort: data.sort || 0,
        status: data.status ?? 1,
        addTime: BigInt(Date.now()),
      },
    });
  }

  async update(id: number, data: UpdateUserLabelDto) {
    const label = await this.prisma.userLabel.findUnique({ where: { id } });
    if (!label) throw new NotFoundException('标签不存在');

    return this.prisma.userLabel.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.color !== undefined && { color: data.color }),
        ...(data.sort !== undefined && { sort: data.sort }),
        ...(data.status !== undefined && { status: data.status }),
      },
    });
  }

  async delete(id: number) {
    const label = await this.prisma.userLabel.findUnique({ where: { id } });
    if (!label) throw new NotFoundException('标签不存在');
    return this.prisma.userLabel.delete({ where: { id } });
  }
}
