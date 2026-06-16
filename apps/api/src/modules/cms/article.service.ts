import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateArticleDto, UpdateArticleDto } from './dto/cms.dto';

@Injectable()
export class ArticleService {
  constructor(private prisma: PrismaService) {}

  async getList(query: { page?: number; limit?: number; title?: string; cid?: number }) {
    const { page = 1, limit = 10, title, cid } = query;
    const where: any = {};

    if (title) {
      where.title = { contains: title };
    }
    if (cid !== undefined) {
      where.cid = cid;
    }

    const [list, total] = await Promise.all([
      this.prisma.article.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: 'desc' },
      }),
      this.prisma.article.count({ where }),
    ]);

    return { data: list, total, page, limit };
  }

  async getDetail(id: number) {
    const article = await this.prisma.article.findUnique({ where: { id } });
    if (!article) {
      throw new NotFoundException('文章不存在');
    }
    return article;
  }

  async create(data: CreateArticleDto) {
    return this.prisma.article.create({
      data: {
        title: data.title,
        author: data.author || '',
        imageInput: data.image_input || '',
        content: data.content,
        digest: data.digest || '',
        cid: data.cid || 0,
        sort: data.sort || 0,
        isHot: data.is_hot || 0,
        isBest: data.is_best || 0,
        isNew: data.is_new || 0,
        visit: 0,
        status: 1,
        addTime: BigInt(Date.now()),
      },
    });
  }

  async update(id: number, data: UpdateArticleDto) {
    const article = await this.prisma.article.findUnique({ where: { id } });
    if (!article) {
      throw new NotFoundException('文章不存在');
    }

    return this.prisma.article.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.author !== undefined && { author: data.author }),
        ...(data.image_input !== undefined && { imageInput: data.image_input }),
        ...(data.content !== undefined && { content: data.content }),
        ...(data.digest !== undefined && { digest: data.digest }),
        ...(data.cid !== undefined && { cid: data.cid }),
        ...(data.sort !== undefined && { sort: data.sort }),
        ...(data.is_hot !== undefined && { isHot: data.is_hot }),
        ...(data.is_best !== undefined && { isBest: data.is_best }),
        ...(data.is_new !== undefined && { isNew: data.is_new }),
        ...(data.status !== undefined && { status: data.status }),
      },
    });
  }

  async delete(id: number) {
    const article = await this.prisma.article.findUnique({ where: { id } });
    if (!article) {
      throw new NotFoundException('文章不存在');
    }
    return this.prisma.article.delete({ where: { id } });
  }
}
