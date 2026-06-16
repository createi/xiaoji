import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserGroupDto, UpdateUserGroupDto } from './dto/user.dto';

@Injectable()
export class UserGroupService {
  constructor(private prisma: PrismaService) {}

  async getList(params: { page?: number; limit?: number; name?: string }) {
    const { page = 1, limit = 10, name } = params;
    const where: any = {};

    if (name) {
      where.name = { contains: name };
    }

    const [list, total] = await Promise.all([
      this.prisma.userGroup.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { sort: 'asc' },
      }),
      this.prisma.userGroup.count({ where }),
    ]);

    return { data: list, total, page, limit };
  }

  async getAll() {
    return this.prisma.userGroup.findMany({
      where: { status: 1, isShow: 1 },
      orderBy: { sort: 'asc' },
    });
  }

  async getDetail(id: number) {
    const group = await this.prisma.userGroup.findUnique({ where: { id } });
    if (!group) throw new NotFoundException('分组不存在');
    return group;
  }

  async create(data: CreateUserGroupDto) {
    return this.prisma.userGroup.create({
      data: {
        name: data.name,
        image: data.image || '',
        sort: data.sort || 0,
        status: data.status ?? 1,
        isShow: data.is_show ?? 1,
        addTime: BigInt(Date.now()),
      },
    });
  }

  async update(id: number, data: UpdateUserGroupDto) {
    const group = await this.prisma.userGroup.findUnique({ where: { id } });
    if (!group) throw new NotFoundException('分组不存在');

    return this.prisma.userGroup.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.image !== undefined && { image: data.image }),
        ...(data.sort !== undefined && { sort: data.sort }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.is_show !== undefined && { isShow: data.is_show }),
      },
    });
  }

  async delete(id: number) {
    const group = await this.prisma.userGroup.findUnique({ where: { id } });
    if (!group) throw new NotFoundException('分组不存在');
    return this.prisma.userGroup.delete({ where: { id } });
  }
}
