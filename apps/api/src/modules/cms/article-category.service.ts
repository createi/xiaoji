import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateArticleCategoryDto, UpdateArticleCategoryDto } from './dto/cms.dto';

@Injectable()
export class ArticleCategoryService {
  constructor(private prisma: PrismaService) {}

  async getList() {
    return this.prisma.articleCategory.findMany({
      orderBy: { sort: 'asc' },
    });
  }

  async getDetail(id: number) {
    const category = await this.prisma.articleCategory.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException('文章分类不存在');
    }
    return category;
  }

  async create(data: CreateArticleCategoryDto) {
    return this.prisma.articleCategory.create({
      data: {
        name: data.name,
        pid: data.pid || 0,
        sort: data.sort || 0,
        status: data.status ?? 1,
        addTime: BigInt(Date.now()),
      },
    });
  }

  async update(id: number, data: UpdateArticleCategoryDto) {
    const category = await this.prisma.articleCategory.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException('文章分类不存在');
    }

    return this.prisma.articleCategory.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.pid !== undefined && { pid: data.pid }),
        ...(data.sort !== undefined && { sort: data.sort }),
        ...(data.status !== undefined && { status: data.status }),
      },
    });
  }

  async delete(id: number) {
    const category = await this.prisma.articleCategory.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException('文章分类不存在');
    }
    return this.prisma.articleCategory.delete({ where: { id } });
  }
}
