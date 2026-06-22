import {
  Controller,
  Get,
  Put,
  Param,
  Query,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RefundService } from './refund.service';

@ApiTags('退款管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('order/refund')
export class RefundController {
  constructor(private readonly refundService: RefundService) {}

  @Get('list')
  @ApiOperation({ summary: '退款记录列表' })
  async getList(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('keyword') keyword?: string,
  ) {
    const result = await this.refundService.getList({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      status: status ? Number(status) : undefined,
      keyword,
    });
    return { status: 200, message: '获取成功', data: result };
  }

  @Get(':id')
  @ApiOperation({ summary: '退款记录详情' })
  async getDetail(@Param('id', ParseIntPipe) id: number) {
    const result = await this.refundService.getDetail(id);
    return { status: 200, message: '获取成功', data: result };
  }

  @Put(':id')
  @ApiOperation({ summary: '审核退款' })
  async audit(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { status: number; mark?: string },
  ) {
    const result = await this.refundService.audit(id, body);
    return { status: 200, message: '审核成功', data: result };
  }
}
