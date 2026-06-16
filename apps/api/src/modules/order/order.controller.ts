import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrderService } from './order.service';
import { QueryOrderDto, UpdateOrderDto, ShipOrderDto } from './dto/order.dto';

@ApiTags('订单管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('list')
  @ApiOperation({ summary: '订单列表' })
  async getList(@Query() query: QueryOrderDto) {
    const result = await this.orderService.getList(query);
    return { status: 200, message: '获取成功', data: result };
  }

  @Get(':id')
  @ApiOperation({ summary: '订单详情' })
  async getDetail(@Param('id', ParseIntPipe) id: number) {
    const result = await this.orderService.getDetail(id);
    return { status: 200, message: '获取成功', data: result };
  }

  @Put(':id')
  @ApiOperation({ summary: '更新订单' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderDto,
  ) {
    const result = await this.orderService.update(id, dto);
    return { status: 200, message: '更新成功', data: result };
  }

  @Put(':id/ship')
  @ApiOperation({ summary: '订单发货' })
  async ship(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ShipOrderDto,
  ) {
    const result = await this.orderService.ship(id, dto);
    return { status: 200, message: '发货成功', data: result };
  }

  @Put(':id/confirm')
  @ApiOperation({ summary: '确认收货' })
  async confirmReceipt(@Param('id', ParseIntPipe) id: number) {
    const result = await this.orderService.confirmReceipt(id);
    return { status: 200, message: '确认收货成功', data: result };
  }

  @Put(':id/cancel')
  @ApiOperation({ summary: '取消订单' })
  async cancel(@Param('id', ParseIntPipe) id: number) {
    const result = await this.orderService.cancel(id);
    return { status: 200, message: '取消成功', data: result };
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除订单' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.orderService.delete(id);
    return { status: 200, message: '删除成功' };
  }
}
