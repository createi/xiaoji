import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StatisticService } from './statistic.service';

@ApiTags('数据统计')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('statistic')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @Get('dashboard')
  @ApiOperation({ summary: '仪表盘数据' })
  async getDashboard() {
    const result = await this.statisticService.getDashboard();
    return { status: 200, message: '获取成功', data: result };
  }

  @Get('transaction')
  @ApiOperation({ summary: '交易统计' })
  async getTransactionStatistics(@Query('type') type?: string) {
    const result = await this.statisticService.getTransactionStatistics({ type });
    return { status: 200, message: '获取成功', data: result };
  }

  @Get('product')
  @ApiOperation({ summary: '商品统计' })
  async getProductStatistics() {
    const result = await this.statisticService.getProductStatistics();
    return { status: 200, message: '获取成功', data: result };
  }

  @Get('user')
  @ApiOperation({ summary: '用户统计' })
  async getUserStatistics() {
    const result = await this.statisticService.getUserStatistics();
    return { status: 200, message: '获取成功', data: result };
  }
}
