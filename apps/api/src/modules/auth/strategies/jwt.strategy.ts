import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service';

export interface JwtPayload {
  id: number;
  account: string;
  level: number;
  type: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret'),
    });
  }

  async validate(payload: JwtPayload) {
    if (payload.type !== 'admin') {
      throw new UnauthorizedException('无效的Token类型');
    }

    const admin = await this.prisma.systemAdmin.findUnique({
      where: { id: payload.id },
    });

    if (!admin) {
      throw new UnauthorizedException('管理员不存在');
    }

    if (admin.status === 0) {
      throw new UnauthorizedException('账号已被禁用');
    }

    return {
      id: admin.id,
      account: admin.account,
      level: admin.level,
      type: payload.type,
    };
  }
}
