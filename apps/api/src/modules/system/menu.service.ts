import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  /**
   * 获取菜单列表（树形）
   */
  async getList(params: { page?: number; limit?: number; title?: string }) {
    const { page = 1, limit = 10, title } = params;
    const where: any = {};

    if (title) {
      where.title = { contains: title };
    }

    const [list, total] = await Promise.all([
      this.prisma.systemMenus.findMany({
        where,
        orderBy: { sort: 'asc' },
      }),
      this.prisma.systemMenus.count({ where }),
    ]);

    // 构建树形结构
    const tree = this.buildTree(list, 0);

    return {
      data: tree,
      total,
      page,
      limit,
    };
  }

  /**
   * 获取所有菜单（用于权限选择）
   */
  async getAll() {
    const list = await this.prisma.systemMenus.findMany({
      where: { status: 1 },
      orderBy: { sort: 'asc' },
    });

    return this.buildTree(list, 0);
  }

  /**
   * 创建菜单
   */
  async create(data: {
    pid?: number;
    title: string;
    icon?: string;
    path?: string;
    component?: string;
    sort?: number;
    status?: number;
    is_show?: number;
  }) {
    return this.prisma.systemMenus.create({
      data: {
        pid: data.pid || 0,
        title: data.title,
        icon: data.icon || '',
        path: data.path || '',
        component: data.component || '',
        sort: data.sort || 0,
        status: data.status ?? 1,
        isShow: data.is_show ?? 1,
        addTime: BigInt(Date.now()),
      },
    });
  }

  /**
   * 更新菜单
   */
  async update(
    id: number,
    data: {
      pid?: number;
      title?: string;
      icon?: string;
      path?: string;
      component?: string;
      sort?: number;
      status?: number;
      is_show?: number;
    },
  ) {
    const menu = await this.prisma.systemMenus.findUnique({ where: { id } });
    if (!menu) {
      throw new NotFoundException('菜单不存在');
    }

    return this.prisma.systemMenus.update({
      where: { id },
      data: {
        ...(data.pid !== undefined && { pid: data.pid }),
        ...(data.title !== undefined && { title: data.title }),
        ...(data.icon !== undefined && { icon: data.icon }),
        ...(data.path !== undefined && { path: data.path }),
        ...(data.component !== undefined && { component: data.component }),
        ...(data.sort !== undefined && { sort: data.sort }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.is_show !== undefined && { isShow: data.is_show }),
      },
    });
  }

  /**
   * 删除菜单
   */
  async delete(id: number) {
    const menu = await this.prisma.systemMenus.findUnique({ where: { id } });
    if (!menu) {
      throw new NotFoundException('菜单不存在');
    }

    // 检查是否有子菜单
    const childCount = await this.prisma.systemMenus.count({
      where: { pid: id },
    });

    if (childCount > 0) {
      throw new NotFoundException('存在子菜单，无法删除');
    }

    return this.prisma.systemMenus.delete({ where: { id } });
  }

  /**
   * 构建树形结构
   */
  private buildTree(list: any[], pid: number): any[] {
    return list
      .filter((item) => item.pid === pid)
      .map((item) => ({
        id: item.id,
        pid: item.pid,
        title: item.title,
        icon: item.icon,
        path: item.path,
        component: item.component,
        sort: item.sort,
        status: item.status,
        is_show: item.isShow,
        add_time: item.addTime,
        children: this.buildTree(list, item.id),
      }));
  }
}
