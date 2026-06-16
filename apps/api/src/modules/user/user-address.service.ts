import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserAddressDto, UpdateUserAddressDto } from './dto/user.dto';

@Injectable()
export class UserAddressService {
  constructor(private prisma: PrismaService) {}

  async getList(params: { uid?: number; page?: number; limit?: number }) {
    const { uid, page = 1, limit = 10 } = params;
    const where: any = {};

    if (uid) {
      where.uid = uid;
    }

    const [list, total] = await Promise.all([
      this.prisma.userAddress.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { isDefault: 'desc' },
      }),
      this.prisma.userAddress.count({ where }),
    ]);

    return { data: list, total, page, limit };
  }

  async getByUid(uid: number) {
    return this.prisma.userAddress.findMany({
      where: { uid },
      orderBy: { isDefault: 'desc' },
    });
  }

  async getDetail(id: number) {
    const address = await this.prisma.userAddress.findUnique({ where: { id } });
    if (!address) throw new NotFoundException('地址不存在');
    return address;
  }

  async create(data: CreateUserAddressDto) {
    // 如果设为默认，先取消其他默认地址
    if (data.is_default === 1) {
      await this.prisma.userAddress.updateMany({
        where: { uid: data.uid, isDefault: 1 },
        data: { isDefault: 0 },
      });
    }

    return this.prisma.userAddress.create({
      data: {
        uid: data.uid,
        realName: data.real_name,
        phone: data.phone,
        province: data.province,
        city: data.city,
        district: data.district,
        detail: data.detail,
        isDefault: data.is_default || 0,
        latitude: data.latitude || 0,
        longitude: data.longitude || 0,
        addTime: BigInt(Date.now()),
      },
    });
  }

  async update(id: number, data: UpdateUserAddressDto) {
    const address = await this.prisma.userAddress.findUnique({ where: { id } });
    if (!address) throw new NotFoundException('地址不存在');

    // 如果设为默认，先取消其他默认地址
    if (data.is_default === 1) {
      await this.prisma.userAddress.updateMany({
        where: { uid: address.uid, isDefault: 1, id: { not: id } },
        data: { isDefault: 0 },
      });
    }

    return this.prisma.userAddress.update({
      where: { id },
      data: {
        ...(data.real_name !== undefined && { realName: data.real_name }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.province !== undefined && { province: data.province }),
        ...(data.city !== undefined && { city: data.city }),
        ...(data.district !== undefined && { district: data.district }),
        ...(data.detail !== undefined && { detail: data.detail }),
        ...(data.is_default !== undefined && { isDefault: data.is_default }),
        ...(data.latitude !== undefined && { latitude: data.latitude }),
        ...(data.longitude !== undefined && { longitude: data.longitude }),
      },
    });
  }

  async delete(id: number) {
    const address = await this.prisma.userAddress.findUnique({ where: { id } });
    if (!address) throw new NotFoundException('地址不存在');
    return this.prisma.userAddress.delete({ where: { id } });
  }
}
