import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { QueueService } from './queue.service';

@ApiTags('任务队列')
@Controller('queue')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Get('status')
  @ApiOperation({ summary: '获取所有队列状态' })
  async getAllStatus() {
    return {
      status: 200,
      message: '获取成功',
      data: this.queueService.getAllQueuesStatus(),
    };
  }

  @Get('status/:type')
  @ApiOperation({ summary: '获取指定队列状态' })
  async getStatus(@Param('type') type: string) {
    return {
      status: 200,
      message: '获取成功',
      data: this.queueService.getQueueStatus(type),
    };
  }

  @Get('job/:id')
  @ApiOperation({ summary: '获取任务详情' })
  async getJob(@Param('id') id: string) {
    const job = this.queueService.getJob(id);
    if (!job) {
      return {
        status: 404,
        message: '任务不存在',
        data: null,
      };
    }
    return {
      status: 200,
      message: '获取成功',
      data: job,
    };
  }

  @Post('retry/:id')
  @ApiOperation({ summary: '重试失败任务' })
  async retryJob(@Param('id') id: string) {
    const success = this.queueService.retryJob(id);
    if (!success) {
      return {
        status: 400,
        message: '任务不存在或无法重试',
        data: null,
      };
    }
    return {
      status: 200,
      message: '重试成功',
      data: null,
    };
  }

  @Post('clear/:type')
  @ApiOperation({ summary: '清空已完成任务' })
  async clearCompleted(@Param('type') type: string) {
    this.queueService.clearCompleted(type);
    return {
      status: 200,
      message: '清空成功',
      data: null,
    };
  }
}
