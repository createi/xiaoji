import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StaffService {
  constructor(private prisma: PrismaService) {}

  /**
   * 店员列表
   */
  async getList(params: {
    page: number;
    limit: number;
    storeId?: number;
    keywords?: string;
  }) {
    const { page, limit, storeId, keywords } = params;
    const where: any = {};

    if (storeId) {
      where.storeId = storeId;
    }

    // 按用户昵称/手机号搜索
    if (keywords) {
      const users = await this.prisma.user.findMany({
        where: {
          OR: [
            { nickname: { contains: keywords } },
            { phone: { contains: keywords } },
          ],
        },
        select: { uid: true },
      });
      where.uid = { in: users.map((u) => u.uid) };
    }

    const [list, total] = await Promise.all([
      this.prisma.systemStoreStaff.findMany({
        where,
        orderBy: { addTime: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.systemStoreStaff.count({ where }),
    ]);

    // 批量获取用户和门店信息
    const uids = [...new Set(list.map((s) => s.uid))];
    const storeIds = [...new Set(list.map((s) => s.storeId))];

    const [users, stores] = await Promise.all([
      this.prisma.user.findMany({
        where: { uid: { in: uids } },
        select: { uid: true, nickname: true, avatar: true, phone: true },
      }),
      this.prisma.systemStore.findMany({
        where: { id: { in: storeIds } },
        select: { id: true, name: true },
      }),
    ]);

    const userMap = new Map(users.map((u) => [u.uid, u]));
    const storeMap = new Map(stores.map((s) => [s.id, s]));

    const data = list.map((item) => ({
      id: item.id,
      uid: item.uid,
      nickname: userMap.get(item.uid)?.nickname || '',
      avatar: userMap.get(item.uid)?.avatar || '',
      phone: userMap.get(item.uid)?.phone || '',
      store_id: item.storeId,
      store_name: storeMap.get(item.storeId)?.name || '',
      role: item.role,
      status: item.status,
      add_time: Number(item.addTime),
    }));

    return {
      data,
      total,
      page,
      limit,
    };
  }

  /**
   * 添加店员
   */
  async create(data: { uid: number; store_id: number; role?: string }) {
    // 检查用户是否存在
    const user = await this.prisma.user.findUnique({ where: { uid: data.uid } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 检查门店是否存在
    const store = await this.prisma.systemStore.findUnique({ where: { id: data.store_id } });
    if (!store) {
      throw new NotFoundException('门店不存在');
    }

    // 检查是否已经是该门店的店员
    const existing = await this.prisma.systemStoreStaff.findFirst({
      where: { uid: data.uid, storeId: data.store_id },
    });
    if (existing) {
      throw new NotFoundException('该用户已是该门店店员');
    }

    return this.prisma.systemStoreStaff.create({
      data: {
        uid: data.uid,
        storeId: data.store_id,
        role: data.role || 'clerk',
        status: 1,
        addTime: BigInt(Date.now()),
      },
    });
  }

  /**
   * 更新店员
   */
  async update(id: number, data: { role?: string; status?: number; store_id?: number }) {
    const staff = await this.prisma.systemStoreStaff.findUnique({ where: { id } });
    if (!staff) {
      throw new NotFoundException('店员不存在');
    }

    return this.prisma.systemStoreStaff.update({
      where: { id },
      data: {
        ...(data.role !== undefined && { role: data.role }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.store_id !== undefined && { storeId: data.store_id }),
      },
    });
  }

  /**
   * 删除店员
   */
  async delete(id: number) {
    const staff = await this.prisma.systemStoreStaff.findUnique({ where: { id } });
    if (!staff) {
      throw new NotFoundException('店员不存在');
    }

    return this.prisma.systemStoreStaff.delete({ where: { id } });
  }
}
