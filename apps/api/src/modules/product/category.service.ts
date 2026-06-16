import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/product.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async getList(params: { page?: number; limit?: number; name?: string }) {
    const { page = 1, limit = 10, name } = params;
    const where: any = {};

    if (name) {
      where.name = { contains: name };
    }

    const [list, total] = await Promise.all([
      this.prisma.storeCategory.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { sort: 'asc' },
      }),
      this.prisma.storeCategory.count({ where }),
    ]);

    return {
      data: list.map((item) => ({
        ...item,
        add_time: item.addTime ? Number(item.addTime) : null,
      })),
      total,
      page,
      limit,
    };
  }

  async getAll() {
    const list = await this.prisma.storeCategory.findMany({
      where: { isShow: 1 },
      orderBy: { sort: 'asc' },
    });
    return this.buildTree(list, 0);
  }

  private buildTree(list: any[], pid: number): any[] {
    return list
      .filter((item) => item.pid === pid)
      .map((item) => ({
        ...item,
        add_time: item.addTime ? Number(item.addTime) : null,
        children: this.buildTree(list, item.id),
      }));
  }

  async getDetail(id: number) {
    const category = await this.prisma.storeCategory.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('分类不存在');
    return category;
  }

  async create(data: CreateCategoryDto) {
    return this.prisma.storeCategory.create({
      data: {
        pid: data.pid || 0,
        name: data.name,
        icon: data.icon || '',
        image: data.image || '',
        sort: data.sort || 0,
        isShow: data.is_show ?? 1,
        isHome: data.is_home || 0,
        addTime: BigInt(Date.now()),
      },
    });
  }

  async update(id: number, data: UpdateCategoryDto) {
    const category = await this.prisma.storeCategory.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('分类不存在');

    return this.prisma.storeCategory.update({
      where: { id },
      data: {
        ...(data.pid !== undefined && { pid: data.pid }),
        ...(data.name !== undefined && { name: data.name }),
        ...(data.icon !== undefined && { icon: data.icon }),
        ...(data.image !== undefined && { image: data.image }),
        ...(data.sort !== undefined && { sort: data.sort }),
        ...(data.is_show !== undefined && { isShow: data.is_show }),
        ...(data.is_home !== undefined && { isHome: data.is_home }),
      },
    });
  }

  async delete(id: number) {
    const category = await this.prisma.storeCategory.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('分类不存在');

    // 检查是否有子分类
    const children = await this.prisma.storeCategory.count({ where: { pid: id } });
    if (children > 0) {
      throw new Error('该分类下有子分类，无法删除');
    }

    return this.prisma.storeCategory.delete({ where: { id } });
  }
}
