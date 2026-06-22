import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommissionService } from './commission.service';

@ApiTags('佣金管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('finance/commission')
export class CommissionController {
  constructor(private readonly commissionService: CommissionService) {}

  @Get('list')
  @ApiOperation({ summary: '佣金记录列表' })
  async getList(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('keyword') keyword?: string,
  ) {
    const result = await this.commissionService.getList({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      keyword,
    });
    return { status: 200, message: '获取成功', data: result };
  }
}
