import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LogService } from './log.service';

@ApiTags('操作日志')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('system/log')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Get()
  @ApiOperation({ summary: '获取操作日志列表' })
  async getList(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('admin_name') adminName?: string,
    @Query('type') type?: string,
    @Query('url') url?: string,
    @Query('start_time') startTime?: string,
    @Query('end_time') endTime?: string,
  ) {
    const result = await this.logService.getList({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 15,
      adminName,
      type,
      url,
      startTime,
      endTime,
    });
    return {
      status: 200,
      message: '获取成功',
      data: result,
    };
  }
}
