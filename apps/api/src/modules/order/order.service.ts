import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryOrderDto, UpdateOrderDto, ShipOrderDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async getList(query: QueryOrderDto) {
    const { page = 1, limit = 10, status, type, search_type, keyword, start_time, end_time } = query;
    const where: any = { isDel: 0 };

    if (status !== undefined) {
      where.status = status;
    }
    if (type !== undefined) {
      where.type = type;
    }

    if (keyword) {
      if (search_type === 'order_id') {
        where.orderId = keyword;
      } else if (search_type === 'uid') {
        where.uid = parseInt(keyword, 10);
      } else if (search_type === 'real_name') {
        where.realName = { contains: keyword };
      } else if (search_type === 'user_phone') {
        where.userPhone = { contains: keyword };
      } else {
        where.OR = [
          { orderId: { contains: keyword } },
          { realName: { contains: keyword } },
          { userPhone: { contains: keyword } },
        ];
      }
    }

    if (start_time || end_time) {
      where.addTime = {};
      if (start_time) where.addTime.gte = BigInt(new Date(start_time).getTime());
      if (end_time) where.addTime.lte = BigInt(new Date(end_time).getTime());
    }

    const [list, total] = await Promise.all([
      this.prisma.storeOrder.findMany({
        where,
        include: {
          cartInfos: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { addTime: 'desc' },
      }),
      this.prisma.storeOrder.count({ where }),
    ]);

    return { data: list, total, page, limit };
  }

  async getDetail(id: number) {
    const order = await this.prisma.storeOrder.findUnique({
      where: { id },
      include: {
        cartInfos: true,
        refunds: true,
      },
    });

    if (!order) {
      throw new NotFoundException('订单不存在');
    }

    return order;
  }

  async getByOrderId(orderId: string) {
    const order = await this.prisma.storeOrder.findUnique({
      where: { orderId },
      include: {
        cartInfos: true,
        refunds: true,
      },
    });

    if (!order) {
      throw new NotFoundException('订单不存在');
    }

    return order;
  }

  async update(id: number, data: UpdateOrderDto) {
    const order = await this.prisma.storeOrder.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException('订单不存在');
    }

    return this.prisma.storeOrder.update({
      where: { id },
      data: {
        ...(data.remark !== undefined && { remark: data.remark }),
        ...(data.real_name !== undefined && { realName: data.real_name }),
        ...(data.user_phone !== undefined && { userPhone: data.user_phone }),
        ...(data.user_address !== undefined && { userAddress: data.user_address }),
      },
    });
  }

  async ship(id: number, data: ShipOrderDto) {
    const order = await this.prisma.storeOrder.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException('订单不存在');
    }

    if (order.status !== 1) {
      throw new BadRequestException('订单状态不允许发货');
    }

    return this.prisma.storeOrder.update({
      where: { id },
      data: {
        deliveryName: data.delivery_name,
        deliveryId: data.delivery_id,
        deliveryType: data.delivery_type || '快递',
        status: 2,
      },
    });
  }

  async confirmReceipt(id: number) {
    const order = await this.prisma.storeOrder.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException('订单不存在');
    }

    if (order.status !== 2) {
      throw new BadRequestException('订单状态不允许确认收货');
    }

    return this.prisma.storeOrder.update({
      where: { id },
      data: { status: 3 },
    });
  }

  async delete(id: number) {
    const order = await this.prisma.storeOrder.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException('订单不存在');
    }

    return this.prisma.storeOrder.update({
      where: { id },
      data: { isDel: 1 },
    });
  }

  async cancel(id: number) {
    const order = await this.prisma.storeOrder.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException('订单不存在');
    }

    if (order.paid === 1) {
      throw new BadRequestException('已支付订单不能直接取消');
    }

    return this.prisma.storeOrder.update({
      where: { id },
      data: { isCancel: 1, status: -1 },
    });
  }
}
