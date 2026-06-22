import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StoreService {
  constructor(private prisma: PrismaService) {}

  /**
   * 门店列表
   */
  async getList(params: {
    page: number;
    limit: number;
    keywords?: string;
  }) {
    const { page, limit, keywords } = params;
    const where: any = {};

    if (keywords) {
      where.OR = [
        { name: { contains: keywords } },
        { phone: { contains: keywords } },
      ];
    }

    const [list, total] = await Promise.all([
      this.prisma.systemStore.findMany({
        where,
        orderBy: { sort: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.systemStore.count({ where }),
    ]);

    return {
      data: list.map((item) => ({
        id: item.id,
        image: item.image,
        name: item.name,
        phone: item.phone,
        address: item.address,
        detailed_address: item.detailedAddress,
        latitude: Number(item.latitude),
        longitude: Number(item.longitude),
        day_time: item.dayTime,
        is_show: item.isShow,
        sort: item.sort,
        add_time: Number(item.addTime),
      })),
      total,
      page,
      limit,
    };
  }

  /**
   * 所有门店（下拉选择）
   */
  async getAll() {
    const list = await this.prisma.systemStore.findMany({
      where: { isShow: 1 },
      orderBy: { sort: 'asc' },
      select: { id: true, name: true },
    });
    return list;
  }

  /**
   * 门店详情
   */
  async getDetail(id: number) {
    const store = await this.prisma.systemStore.findUnique({
      where: { id },
      include: {
        staffs: {
          include: {
            // 包含用户信息
          },
        },
      },
    });

    if (!store) {
      throw new NotFoundException('门店不存在');
    }

    return {
      id: store.id,
      image: store.image,
      name: store.name,
      phone: store.phone,
      address: store.address,
      detailed_address: store.detailedAddress,
      latitude: Number(store.latitude),
      longitude: Number(store.longitude),
      day_time: store.dayTime,
      is_show: store.isShow,
      sort: store.sort,
      add_time: Number(store.addTime),
    };
  }

  /**
   * 创建门店
   */
  async create(data: any) {
    return this.prisma.systemStore.create({
      data: {
        image: data.image || '',
        name: data.name,
        phone: data.phone || '',
        address: data.address || '',
        detailedAddress: data.detailed_address || '',
        latitude: data.latitude || 0,
        longitude: data.longitude || 0,
        dayTime: data.day_time || '',
        isShow: data.is_show ?? 1,
        sort: data.sort || 0,
        addTime: BigInt(Date.now()),
      },
    });
  }

  /**
   * 更新门店
   */
  async update(id: number, data: any) {
    const store = await this.prisma.systemStore.findUnique({ where: { id } });
    if (!store) {
      throw new NotFoundException('门店不存在');
    }

    return this.prisma.systemStore.update({
      where: { id },
      data: {
        ...(data.image !== undefined && { image: data.image }),
        ...(data.name !== undefined && { name: data.name }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.address !== undefined && { address: data.address }),
        ...(data.detailed_address !== undefined && { detailedAddress: data.detailed_address }),
        ...(data.latitude !== undefined && { latitude: data.latitude }),
        ...(data.longitude !== undefined && { longitude: data.longitude }),
        ...(data.day_time !== undefined && { dayTime: data.day_time }),
        ...(data.is_show !== undefined && { isShow: data.is_show }),
        ...(data.sort !== undefined && { sort: data.sort }),
      },
    });
  }

  /**
   * 删除门店
   */
  async delete(id: number) {
    const store = await this.prisma.systemStore.findUnique({ where: { id } });
    if (!store) {
      throw new NotFoundException('门店不存在');
    }

    // 检查是否有店员
    const staffCount = await this.prisma.systemStoreStaff.count({
      where: { storeId: id },
    });
    if (staffCount > 0) {
      throw new NotFoundException('门店下有店员，无法删除');
    }

    return this.prisma.systemStore.delete({ where: { id } });
  }
}
