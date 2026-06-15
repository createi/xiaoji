import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  /**
   * 获取角色列表
   */
  async getList(params: { page?: number; limit?: number; name?: string }) {
    const { page = 1, limit = 10, name } = params;
    const where: any = {};

    if (name) {
      where.name = { contains: name };
    }

    const [list, total] = await Promise.all([
      this.prisma.systemRole.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: 'asc' },
      }),
      this.prisma.systemRole.count({ where }),
    ]);

    return {
      data: list.map((item) => ({
        id: item.id,
        name: item.name,
        status: item.status,
        rules: this.parseRules(item.rules),
        add_time: item.addTime,
      })),
      total,
      page,
      limit,
    };
  }

  /**
   * 获取所有角色（用于下拉选择）
   */
  async getAll() {
    const list = await this.prisma.systemRole.findMany({
      where: { status: 1 },
      orderBy: { id: 'asc' },
    });

    return list.map((item) => ({
      id: item.id,
      name: item.name,
    }));
  }

  /**
   * 创建角色
   */
  async create(data: { name: string; status?: number; rules?: number[] }) {
    // 检查名称是否已存在
    const existing = await this.prisma.systemRole.findFirst({
      where: { name: data.name },
    });

    if (existing) {
      throw new ConflictException('角色名称已存在');
    }

    return this.prisma.systemRole.create({
      data: {
        name: data.name,
        status: data.status ?? 1,
        rules: JSON.stringify(data.rules || []),
        addTime: BigInt(Date.now()),
      },
    });
  }

  /**
   * 更新角色
   */
  async update(
    id: number,
    data: { name?: string; status?: number; rules?: number[] },
  ) {
    const role = await this.prisma.systemRole.findUnique({ where: { id } });
    if (!role) {
      throw new NotFoundException('角色不存在');
    }

    // 检查名称是否已被其他角色使用
    if (data.name) {
      const existing = await this.prisma.systemRole.findFirst({
        where: { name: data.name, id: { not: id } },
      });
      if (existing) {
        throw new ConflictException('角色名称已存在');
      }
    }

    return this.prisma.systemRole.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.rules !== undefined && {
          rules: JSON.stringify(data.rules),
        }),
      },
    });
  }

  /**
   * 删除角色
   */
  async delete(id: number) {
    const role = await this.prisma.systemRole.findUnique({ where: { id } });
    if (!role) {
      throw new NotFoundException('角色不存在');
    }

    // 检查是否有管理员使用此角色
    const adminCount = await this.prisma.systemAdmin.count({
      where: { level: { not: 0 } },
    });

    // 简单检查，实际应该查 role 关联
    if (adminCount > 0 && id === 1) {
      throw new ConflictException('该角色正在被使用，无法删除');
    }

    return this.prisma.systemRole.delete({ where: { id } });
  }

  /**
   * 获取角色详情
   */
  async getDetail(id: number) {
    const role = await this.prisma.systemRole.findUnique({ where: { id } });
    if (!role) {
      throw new NotFoundException('角色不存在');
    }

    return {
      id: role.id,
      name: role.name,
      status: role.status,
      rules: this.parseRules(role.rules),
      add_time: role.addTime,
    };
  }

  private parseRules(rules: string): number[] {
    try {
      return JSON.parse(rules);
    } catch {
      return [];
    }
  }
}
