import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryExtractDto, AuditExtractDto } from './dto/finance.dto';

@Injectable()
export class ExtractService {
  constructor(private prisma: PrismaService) {}

  async getList(query: QueryExtractDto) {
    const { page = 1, limit = 10, status, keyword } = query;
    const where: any = {};

    if (status !== undefined) {
      where.status = status;
    }

    if (keyword) {
      where.realName = { contains: keyword };
    }

    const [list, total] = await Promise.all([
      this.prisma.userExtract.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: 'desc' },
      }),
      this.prisma.userExtract.count({ where }),
    ]);

    return { data: list, total, page, limit };
  }

  async getDetail(id: number) {
    const extract = await this.prisma.userExtract.findUnique({ where: { id } });
    if (!extract) {
      throw new NotFoundException('提现记录不存在');
    }
    return extract;
  }

  async audit(id: number, data: AuditExtractDto) {
    const extract = await this.prisma.userExtract.findUnique({ where: { id } });
    if (!extract) {
      throw new NotFoundException('提现记录不存在');
    }

    if (extract.status !== 0) {
      throw new BadRequestException('该记录已处理');
    }

    return this.prisma.userExtract.update({
      where: { id },
      data: {
        status: data.status,
        mark: data.mark || '',
      },
    });
  }
}
