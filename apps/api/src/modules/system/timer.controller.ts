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
import { TimerService } from './timer.service';

@ApiTags('定时任务')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('system/timer')
export class TimerController {
  constructor(private readonly timerService: TimerService) {}

  @Get('list')
  @ApiOperation({ summary: '定时任务列表' })
  async getList(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.timerService.getList({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
    return {
      status: 200,
      message: '获取成功',
      data: result,
    };
  }

  @Post()
  @ApiOperation({ summary: '创建定时任务' })
  async create(
    @Body()
    body: {
      name: string;
      command: string;
      cron: string;
      status?: number;
      remark?: string;
    },
  ) {
    const result = await this.timerService.create(body);
    return {
      status: 200,
      message: '创建成功',
      data: result,
    };
  }

  @Put(':id')
  @ApiOperation({ summary: '更新定时任务' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: {
      name?: string;
      command?: string;
      cron?: string;
      status?: number;
      remark?: string;
    },
  ) {
    const result = await this.timerService.update(id, body);
    return {
      status: 200,
      message: '更新成功',
      data: result,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除定时任务' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.timerService.delete(id);
    return {
      status: 200,
      message: '删除成功',
    };
  }
}
