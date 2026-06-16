import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCombinationDto, UpdateCombinationDto } from './dto/combination.dto';

@Injectable()
export class CombinationService {
  constructor(private prisma: PrismaService) {}

  async getList(query: { page?: number; limit?: number; title?: string; is_show?: number }) {
    const { page = 1, limit = 10, title, is_show } = query;
    const where: any = {};

    if (title) {
      where.title = { contains: title };
    }
    if (is_show !== undefined) {
      where.isShow = is_show;
    }

    const [list, total] = await Promise.all([
      this.prisma.storeCombination.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: 'desc' },
      }),
      this.prisma.storeCombination.count({ where }),
    ]);

    return { data: list, total, page, limit };
  }

  async getDetail(id: number) {
    const combination = await this.prisma.storeCombination.findUnique({ where: { id } });
    if (!combination) {
      throw new NotFoundException('拼团活动不存在');
    }
    return combination;
  }

  async create(data: CreateCombinationDto) {
    return this.prisma.storeCombination.create({
      data: {
        title: data.title,
        image: data.image || '',
        info: data.info || '',
        productId: data.product_id,
        price: data.price,
        otPrice: data.ot_price,
        costPrice: 0,
        peopleNum: data.people_num,
        quota: data.quota || 0,
        total: data.total,
        sort: data.sort || 0,
        isShow: data.is_show ?? 1,
        startTime: data.start_time,
        endTime: data.end_time,
        addTime: BigInt(Date.now()),
      },
    });
  }

  async update(id: number, data: UpdateCombinationDto) {
    const combination = await this.prisma.storeCombination.findUnique({ where: { id } });
    if (!combination) {
      throw new NotFoundException('拼团活动不存在');
    }

    return this.prisma.storeCombination.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.image !== undefined && { image: data.image }),
        ...(data.info !== undefined && { info: data.info }),
        ...(data.product_id !== undefined && { productId: data.product_id }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.ot_price !== undefined && { otPrice: data.ot_price }),
        ...(data.people_num !== undefined && { peopleNum: data.people_num }),
        ...(data.total !== undefined && { total: data.total }),
        ...(data.quota !== undefined && { quota: data.quota }),
        ...(data.start_time !== undefined && { startTime: data.start_time }),
        ...(data.end_time !== undefined && { endTime: data.end_time }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.is_show !== undefined && { isShow: data.is_show }),
        ...(data.sort !== undefined && { sort: data.sort }),
      },
    });
  }

  async delete(id: number) {
    const combination = await this.prisma.storeCombination.findUnique({ where: { id } });
    if (!combination) {
      throw new NotFoundException('拼团活动不存在');
    }
    return this.prisma.storeCombination.delete({ where: { id } });
  }
}
