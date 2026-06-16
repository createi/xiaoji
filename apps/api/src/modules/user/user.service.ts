import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getList(query: QueryUserDto) {
    const { page = 1, limit = 10, type, keyword, level, group_id, agent_level, is_promoter, start_time, end_time } = query;
    const where: any = {};

    if (keyword) {
      if (type === 'uid') {
        where.uid = parseInt(keyword, 10);
      } else if (type === 'phone') {
        where.phone = { contains: keyword };
      } else if (type === 'nickname') {
        where.nickname = { contains: keyword };
      } else {
        where.OR = [
          { phone: { contains: keyword } },
          { nickname: { contains: keyword } },
          { realName: { contains: keyword } },
        ];
      }
    }

    if (level !== undefined) where.level = level;
    if (group_id !== undefined) where.groupId = group_id;
    if (agent_level !== undefined) where.agentLevel = agent_level;
    if (is_promoter !== undefined) where.isPromoter = is_promoter;

    if (start_time || end_time) {
      where.addTime = {};
      if (start_time) where.addTime.gte = BigInt(new Date(start_time).getTime());
      if (end_time) where.addTime.lte = BigInt(new Date(end_time).getTime());
    }

    const [list, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { uid: 'desc' },
        select: {
          uid: true,
          account: true,
          realName: true,
          nickname: true,
          avatar: true,
          phone: true,
          sex: true,
          birthday: true,
          groupId: true,
          level: true,
          agentLevel: true,
          spreadOpen: true,
          spreadUid: true,
          userType: true,
          isPromoter: true,
          payCount: true,
          payPrice: true,
          nowMoney: true,
          brokeragePrice: true,
          integral: true,
          exp: true,
          signNum: true,
          status: true,
          addTime: true,
          lastTime: true,
          lastIp: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: list.map((item: any) => ({
        ...item,
        add_time: item.addTime,
        last_time: item.lastTime,
        last_ip: item.lastIp,
        real_name: item.realName,
        pay_price: item.payPrice,
        now_money: item.nowMoney,
        brokerage_price: item.brokeragePrice,
        is_promoter: item.isPromoter,
        agent_level: item.agentLevel,
        group_id: item.groupId,
        spread_uid: item.spreadUid,
        spread_open: item.spreadOpen,
        user_type: item.userType,
        sign_num: item.signNum,
      })),
      total,
      page,
      limit,
    };
  }

  async getDetail(uid: number) {
    const user = await this.prisma.user.findUnique({
      where: { uid },
      include: {
        addresses: true,
      },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return user;
  }

  async update(uid: number, data: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { uid } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return this.prisma.user.update({
      where: { uid },
      data: {
        ...(data.nickname !== undefined && { nickname: data.nickname }),
        ...(data.real_name !== undefined && { realName: data.real_name }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.avatar !== undefined && { avatar: data.avatar }),
        ...(data.sex !== undefined && { sex: data.sex }),
        ...(data.birthday !== undefined && { birthday: BigInt(data.birthday) }),
        ...(data.mark !== undefined && { mark: data.mark }),
        ...(data.level !== undefined && { level: data.level }),
        ...(data.group_id !== undefined && { groupId: data.group_id }),
        ...(data.status !== undefined && { status: data.status }),
      },
    });
  }

  async delete(uid: number) {
    const user = await this.prisma.user.findUnique({ where: { uid } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return this.prisma.user.delete({ where: { uid } });
  }

  async setLevel(uid: number, level: number) {
    const user = await this.prisma.user.findUnique({ where: { uid } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return this.prisma.user.update({
      where: { uid },
      data: { level },
    });
  }

  async setGroup(uid: number, groupId: number) {
    const user = await this.prisma.user.findUnique({ where: { uid } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return this.prisma.user.update({
      where: { uid },
      data: { groupId },
    });
  }
}
