import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  /**
   * 管理员登录
   */
  async adminLogin(account: string, password: string, ip: string) {
    const admin = await this.prisma.systemAdmin.findUnique({
      where: { account },
      include: { role: true },
    });

    if (!admin) {
      throw new UnauthorizedException('账号不存在');
    }

    if (admin.status === 0) {
      throw new UnauthorizedException('账号已被禁用');
    }

    const isPasswordValid = await bcrypt.compare(password, admin.pwd);
    if (!isPasswordValid) {
      throw new UnauthorizedException('密码错误');
    }

    // 更新登录信息
    await this.prisma.systemAdmin.update({
      where: { id: admin.id },
      data: {
        lastTime: BigInt(Date.now()),
        lastIp: ip,
      },
    });

    // 生成 Token
    const payload = {
      id: admin.id,
      account: admin.account,
      level: admin.level,
      type: 'admin',
    };
    const token = this.jwtService.sign(payload);

    return {
      token,
      expires_time: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7天
    };
  }

  /**
   * 获取管理员信息
   */
  async getAdminInfo(adminId: number) {
    const admin = await this.prisma.systemAdmin.findUnique({
      where: { id: adminId },
      include: {
        role: {
          select: {
            id: true,
            name: true,
            rules: true,
          },
        },
      },
    });

    if (!admin) {
      throw new UnauthorizedException('管理员不存在');
    }

    // 解析角色权限
    let rules: number[] = [];
    if (admin.role) {
      try {
        rules = JSON.parse(admin.role.rules);
      } catch {
        rules = [];
      }
    }

    return {
      id: admin.id,
      account: admin.account,
      real_name: admin.realName,
      head_pic: admin.headPic,
      phone: admin.phone,
      level: admin.level,
      status: admin.status,
      last_time: admin.lastTime,
      last_ip: admin.lastIp,
      add_time: admin.addTime,
      role: admin.role
        ? {
            id: admin.role.id,
            name: admin.role.name,
            rules,
          }
        : null,
      uniqueAuth: rules,
      authList: rules.map(String),
      isSuperAdmin: admin.level === 0,
    };
  }

  /**
   * 创建管理员
   */
  async createAdmin(data: {
    account: string;
    real_name: string;
    pwd: string;
    phone?: string;
    role_id?: number;
    head_pic?: string;
  }) {
    // 检查账号是否已存在
    const existing = await this.prisma.systemAdmin.findUnique({
      where: { account: data.account },
    });

    if (existing) {
      throw new ConflictException('账号已存在');
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(data.pwd, 10);

    return this.prisma.systemAdmin.create({
      data: {
        account: data.account,
        realName: data.real_name,
        pwd: hashedPassword,
        phone: data.phone || '',
        headPic: data.head_pic || '',
        level: 0,
        status: 1,
        addTime: BigInt(Date.now()),
      },
    });
  }

  /**
   * 更新管理员
   */
  async updateAdmin(
    id: number,
    data: {
      real_name?: string;
      phone?: string;
      head_pic?: string;
      status?: number;
      role_id?: number;
    },
  ) {
    const admin = await this.prisma.systemAdmin.findUnique({ where: { id } });
    if (!admin) {
      throw new UnauthorizedException('管理员不存在');
    }

    return this.prisma.systemAdmin.update({
      where: { id },
      data: {
        ...(data.real_name !== undefined && { realName: data.real_name }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.head_pic !== undefined && { headPic: data.head_pic }),
        ...(data.status !== undefined && { status: data.status }),
      },
    });
  }

  /**
   * 修改密码
   */
  async changePassword(id: number, oldPassword: string, newPassword: string) {
    const admin = await this.prisma.systemAdmin.findUnique({ where: { id } });
    if (!admin) {
      throw new UnauthorizedException('管理员不存在');
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, admin.pwd);
    if (!isPasswordValid) {
      throw new UnauthorizedException('原密码错误');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return this.prisma.systemAdmin.update({
      where: { id },
      data: { pwd: hashedPassword },
    });
  }

  /**
   * 获取管理员列表
   */
  async getAdminList(params: {
    page?: number;
    limit?: number;
    account?: string;
    real_name?: string;
  }) {
    const { page = 1, limit = 10, account, real_name } = params;
    const where: any = {};

    if (account) {
      where.account = { contains: account };
    }
    if (real_name) {
      where.realName = { contains: real_name };
    }

    const [list, total] = await Promise.all([
      this.prisma.systemAdmin.findMany({
        where,
        include: {
          role: {
            select: { id: true, name: true },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: 'asc' },
      }),
      this.prisma.systemAdmin.count({ where }),
    ]);

    return {
      data: list.map((item) => ({
        id: item.id,
        account: item.account,
        real_name: item.realName,
        head_pic: item.headPic,
        phone: item.phone,
        level: item.level,
        status: item.status,
        last_time: item.lastTime,
        last_ip: item.lastIp,
        add_time: item.addTime,
        role: item.role,
      })),
      total,
      page,
      limit,
    };
  }

  /**
   * 删除管理员
   */
  async deleteAdmin(id: number) {
    const admin = await this.prisma.systemAdmin.findUnique({ where: { id } });
    if (!admin) {
      throw new UnauthorizedException('管理员不存在');
    }

    if (admin.level === 0) {
      throw new ConflictException('不能删除超级管理员');
    }

    return this.prisma.systemAdmin.delete({ where: { id } });
  }
}
