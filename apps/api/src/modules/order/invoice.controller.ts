import { Controller, Get, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { InvoiceService } from './invoice.service';

@ApiTags('发票管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('order/invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Get('list')
  @ApiOperation({ summary: '发票记录列表' })
  async getList(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('keyword') keyword?: string,
  ) {
    const result = await this.invoiceService.getList({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      keyword,
    });
    return { status: 200, message: '获取成功', data: result };
  }

  @Get(':id')
  @ApiOperation({ summary: '发票记录详情' })
  async getDetail(@Param('id', ParseIntPipe) id: number) {
    const result = await this.invoiceService.getDetail(id);
    return { status: 200, message: '获取成功', data: result };
  }
}
