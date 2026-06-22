import { Controller, Get, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CapitalFlowService } from './capital-flow.service';

@ApiTags('资金流水')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('finance/capital-flow')
export class CapitalFlowController {
  constructor(private readonly capitalFlowService: CapitalFlowService) {}

  @Get('list')
  @ApiOperation({ summary: '资金流水列表' })
  async getList(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('type') type?: string,
    @Query('keyword') keyword?: string,
  ) {
    const result = await this.capitalFlowService.getList({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      type: type ? Number(type) : undefined,
      keyword,
    });
    return { status: 200, message: '获取成功', data: result };
  }

  @Get(':id')
  @ApiOperation({ summary: '资金流水详情' })
  async getDetail(@Param('id', ParseIntPipe) id: number) {
    const result = await this.capitalFlowService.getDetail(id);
    return { status: 200, message: '获取成功', data: result };
  }
}
