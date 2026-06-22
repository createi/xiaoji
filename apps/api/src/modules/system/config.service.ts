import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ConfigService {
  constructor(private prisma: PrismaService) {}

  /**
   * 获取配置分类列表
   */
  async getTabs() {
    return this.prisma.systemConfigTab.findMany({
      where: { status: 1 },
      orderBy: { id: 'asc' },
    });
  }

  /**
   * 获取所有配置（按分类分组）
   */
  async getList() {
    const [tabs, configs] = await Promise.all([
      this.prisma.systemConfigTab.findMany({
        where: { status: 1 },
        orderBy: { id: 'asc' },
      }),
      this.prisma.systemConfig.findMany({
        orderBy: { id: 'asc' },
      }),
    ]);

    return tabs.map((tab) => ({
      ...tab,
      configs: configs.filter((c) => c.tabId === tab.id),
    }));
  }

  /**
   * 获取指定分类的配置
   */
  async getByTabId(tabId: number) {
    const [tab, configs] = await Promise.all([
      this.prisma.systemConfigTab.findUnique({ where: { id: tabId } }),
      this.prisma.systemConfig.findMany({
        where: { tabId },
        orderBy: { id: 'asc' },
      }),
    ]);

    return {
      tab,
      configs,
    };
  }

  /**
   * 保存配置
   */
  async save(data: { tabId?: number; configs: Record<string, string> }) {
    const { configs } = data;

    const updates = Object.entries(configs).map(([name, value]) =>
      this.prisma.systemConfig.updateMany({
        where: { name },
        data: { value },
      }),
    );

    await Promise.all(updates);
  }
}
