import {
  Controller,
  Get,
  Post,
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
import { CouponService } from './coupon.service';
import { CreateCouponDto, UpdateCouponDto } from './dto/coupon.dto';

@ApiTags('优惠券管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('marketing/coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Get('list')
  @ApiOperation({ summary: '优惠券列表' })
  async getList(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('title') title?: string,
    @Query('status') status?: number,
  ) {
    const result = await this.couponService.getList({ page, limit, title, status });
    return { status: 200, message: '获取成功', data: result };
  }

  @Get(':id')
  @ApiOperation({ summary: '优惠券详情' })
  async getDetail(@Param('id', ParseIntPipe) id: number) {
    const result = await this.couponService.getDetail(id);
    return { status: 200, message: '获取成功', data: result };
  }

  @Post()
  @ApiOperation({ summary: '创建优惠券' })
  async create(@Body() dto: CreateCouponDto) {
    const result = await this.couponService.create(dto);
    return { status: 200, message: '创建成功', data: result };
  }

  @Put(':id')
  @ApiOperation({ summary: '更新优惠券' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCouponDto) {
    const result = await this.couponService.update(id, dto);
    return { status: 200, message: '更新成功', data: result };
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除优惠券' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.couponService.delete(id);
    return { status: 200, message: '删除成功' };
  }
}
