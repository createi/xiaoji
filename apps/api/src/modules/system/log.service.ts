import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LogService {
  constructor(private prisma: PrismaService) {}

  /**
   * 获取操作日志列表
   */
  async getList(params: {
    page: number;
    limit: number;
    adminName?: string;
    type?: string;
    url?: string;
    startTime?: string;
    endTime?: string;
  }) {
    const { page, limit, adminName, type, url, startTime, endTime } = params;
    const where: any = {};

    if (type) {
      where.type = type;
    }
    if (url) {
      where.url = { contains: url };
    }
    if (startTime || endTime) {
      where.addTime = {};
      if (startTime) {
        where.addTime.gte = BigInt(new Date(startTime).getTime());
      }
      if (endTime) {
        where.addTime.lte = BigInt(new Date(endTime).getTime());
      }
    }

    // 如果需要按管理员名称搜索，先查找管理员 ID
    if (adminName) {
      const admins = await this.prisma.systemAdmin.findMany({
        where: {
          OR: [
            { account: { contains: adminName } },
            { realName: { contains: adminName } },
          ],
        },
        select: { id: true },
      });
      where.adminId = { in: admins.map((a) => a.id) };
    }

    const [list, total] = await Promise.all([
      this.prisma.systemLog.findMany({
        where,
        orderBy: { addTime: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.systemLog.count({ where }),
    ]);

    // 批量获取管理员信息
    const adminIds = [...new Set(list.map((l) => l.adminId))];
    const admins = await this.prisma.systemAdmin.findMany({
      where: { id: { in: adminIds } },
      select: { id: true, account: true, realName: true },
    });
    const adminMap = new Map(admins.map((a) => [a.id, a]));

    const data = list.map((item) => ({
      id: item.id,
      admin_id: item.adminId,
      admin_name: adminMap.get(item.adminId)?.realName || adminMap.get(item.adminId)?.account || '',
      type: item.type,
      url: item.url,
      method: item.method,
      ip: item.ip,
      add_time: Number(item.addTime),
      content: item.content,
    }));

    return {
      data,
      total,
      page,
      limit,
    };
  }
}
