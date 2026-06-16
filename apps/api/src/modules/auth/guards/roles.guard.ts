import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../../prisma/prisma.service';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredMenuIds = this.reflector.getAllAndOverride<number[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredMenuIds || requiredMenuIds.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('未授权访问');
    }

    // level=0 是超级管理员，拥有所有权限
    if (user.level === 0) {
      return true;
    }

    // 查询角色的权限 rules
    const admin = await this.prisma.systemAdmin.findUnique({
      where: { id: user.id },
      select: { roleId: true },
    });

    if (!admin || !admin.roleId) {
      throw new ForbiddenException('未分配角色');
    }

    const role = await this.prisma.systemRole.findUnique({
      where: { id: admin.roleId },
      select: { rules: true },
    });

    if (!role) {
      throw new ForbiddenException('角色不存在');
    }

    let roleRules: number[] = [];
    try {
      roleRules = JSON.parse(role.rules);
    } catch {
      roleRules = [];
    }

    const hasPermission = requiredMenuIds.some((id) => roleRules.includes(id));
    if (!hasPermission) {
      throw new ForbiddenException('无操作权限');
    }

    return true;
  }
}
