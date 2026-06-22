import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class WechatService {
  constructor(private prisma: PrismaService) {}

  // ==================== WechatUser ====================

  /**
   * 微信用户列表
   */
  async getUserList(params: { page: number; limit: number; keywords?: string }) {
    const { page, limit, keywords } = params;
    const where: any = {};

    if (keywords) {
      where.OR = [
        { nickname: { contains: keywords } },
        { openid: { contains: keywords } },
      ];
    }

    const [list, total] = await Promise.all([
      this.prisma.wechatUser.findMany({
        where,
        orderBy: { addTime: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.wechatUser.count({ where }),
    ]);

    const data = list.map((item) => ({
      id: item.id,
      uid: item.uid,
      openid: item.openid,
      nickname: item.nickname,
      headimgurl: item.headimgurl,
      sex: item.sex,
      city: item.city,
      province: item.province,
      country: item.country,
      language: item.language,
      unionid: item.unionid,
      add_time: Number(item.addTime),
    }));

    return { data, total, page, limit };
  }

  // ==================== WechatQrcode ====================

  /**
   * 二维码列表
   */
  async getQrcodeList(params: { page: number; limit: number }) {
    const { page, limit } = params;

    const [list, total] = await Promise.all([
      this.prisma.wechatQrcode.findMany({
        orderBy: { addTime: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.wechatQrcode.count(),
    ]);

    const data = list.map((item) => ({
      id: item.id,
      name: item.name,
      type: item.type,
      group_id: item.groupId,
      category_id: item.categoryId,
      code_url: item.codeUrl,
      image_url: item.imageUrl,
      add_time: Number(item.addTime),
    }));

    return { data, total, page, limit };
  }

  /**
   * 创建二维码
   */
  async createQrcode(data: {
    name: string;
    type?: number;
    group_id?: number;
    category_id?: number;
    code_url?: string;
    image_url?: string;
  }) {
    return this.prisma.wechatQrcode.create({
      data: {
        name: data.name,
        type: data.type ?? 0,
        groupId: data.group_id ?? 0,
        categoryId: data.category_id ?? 0,
        codeUrl: data.code_url ?? '',
        imageUrl: data.image_url ?? '',
        addTime: BigInt(Date.now()),
      },
    });
  }

  /**
   * 删除二维码
   */
  async deleteQrcode(id: number) {
    const qrcode = await this.prisma.wechatQrcode.findUnique({ where: { id } });
    if (!qrcode) {
      throw new NotFoundException('二维码不存在');
    }
    return this.prisma.wechatQrcode.delete({ where: { id } });
  }

  // ==================== WechatReply ====================

  /**
   * 回复规则列表
   */
  async getReplyList(params: { page: number; limit: number }) {
    const { page, limit } = params;

    const [list, total] = await Promise.all([
      this.prisma.wechatReply.findMany({
        orderBy: [{ sort: 'asc' }, { addTime: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.wechatReply.count(),
    ]);

    const data = list.map((item) => ({
      id: item.id,
      uid: item.uid,
      type: item.type,
      content: item.content,
      status: item.status,
      sort: item.sort,
      add_time: Number(item.addTime),
    }));

    return { data, total, page, limit };
  }

  /**
   * 创建回复规则
   */
  async createReply(data: {
    uid?: number;
    type?: string;
    content: string;
    status?: number;
    sort?: number;
  }) {
    return this.prisma.wechatReply.create({
      data: {
        uid: data.uid ?? 0,
        type: data.type ?? 'text',
        content: data.content,
        status: data.status ?? 1,
        sort: data.sort ?? 0,
        addTime: BigInt(Date.now()),
      },
    });
  }

  /**
   * 更新回复规则
   */
  async updateReply(
    id: number,
    data: { type?: string; content?: string; status?: number; sort?: number },
  ) {
    const reply = await this.prisma.wechatReply.findUnique({ where: { id } });
    if (!reply) {
      throw new NotFoundException('回复规则不存在');
    }

    return this.prisma.wechatReply.update({
      where: { id },
      data: {
        ...(data.type !== undefined && { type: data.type }),
        ...(data.content !== undefined && { content: data.content }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.sort !== undefined && { sort: data.sort }),
      },
    });
  }

  /**
   * 删除回复规则
   */
  async deleteReply(id: number) {
    const reply = await this.prisma.wechatReply.findUnique({ where: { id } });
    if (!reply) {
      throw new NotFoundException('回复规则不存在');
    }
    return this.prisma.wechatReply.delete({ where: { id } });
  }

  // ==================== WechatMedia ====================

  /**
   * 素材列表
   */
  async getMediaList(params: { page: number; limit: number; type?: string }) {
    const { page, limit, type } = params;
    const where: any = {};

    if (type) {
      where.type = type;
    }

    const [list, total] = await Promise.all([
      this.prisma.wechatMedia.findMany({
        where,
        orderBy: { addTime: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.wechatMedia.count({ where }),
    ]);

    const data = list.map((item) => ({
      id: item.id,
      type: item.type,
      media_id: item.mediaId,
      name: item.name,
      url: item.url,
      add_time: Number(item.addTime),
    }));

    return { data, total, page, limit };
  }

  // ==================== WechatMessage ====================

  /**
   * 消息列表
   */
  async getMessageList(params: { page: number; limit: number }) {
    const { page, limit } = params;

    const [list, total] = await Promise.all([
      this.prisma.wechatMessage.findMany({
        orderBy: [{ sort: 'asc' }, { addTime: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.wechatMessage.count(),
    ]);

    const data = list.map((item) => ({
      id: item.id,
      type: item.type,
      content: item.content,
      status: item.status,
      sort: item.sort,
      add_time: Number(item.addTime),
    }));

    return { data, total, page, limit };
  }

  // ==================== WechatKey ====================

  /**
   * 关键词列表
   */
  async getKeyList(params: { page: number; limit: number }) {
    const { page, limit } = params;

    const [list, total] = await Promise.all([
      this.prisma.wechatKey.findMany({
        orderBy: { addTime: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.wechatKey.count(),
    ]);

    const data = list.map((item) => ({
      id: item.id,
      name: item.name,
      account: item.account,
      path: item.path,
      qr_code: item.qrCode,
      add_time: Number(item.addTime),
    }));

    return { data, total, page, limit };
  }

  /**
   * 创建关键词
   */
  async createKey(data: {
    name: string;
    account?: string;
    path?: string;
    qr_code?: string;
  }) {
    return this.prisma.wechatKey.create({
      data: {
        name: data.name,
        account: data.account ?? '',
        path: data.path ?? '',
        qrCode: data.qr_code ?? '',
        addTime: BigInt(Date.now()),
      },
    });
  }

  /**
   * 更新关键词
   */
  async updateKey(
    id: number,
    data: { name?: string; account?: string; path?: string; qr_code?: string },
  ) {
    const key = await this.prisma.wechatKey.findUnique({ where: { id } });
    if (!key) {
      throw new NotFoundException('关键词不存在');
    }

    return this.prisma.wechatKey.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.account !== undefined && { account: data.account }),
        ...(data.path !== undefined && { path: data.path }),
        ...(data.qr_code !== undefined && { qrCode: data.qr_code }),
      },
    });
  }
}
