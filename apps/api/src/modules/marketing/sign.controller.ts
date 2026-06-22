import { Controller, Get, Post, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SignService } from './sign.service';

@ApiTags('签到奖励管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('marketing/sign')
export class SignController {
  constructor(private readonly signService: SignService) {}

  @Get('config')
  @ApiOperation({ summary: '获取签到奖励配置' })
  async getConfig() {
    const result = await this.signService.getConfig();
    return { status: 200, message: '获取成功', data: result };
  }

  @Post('config')
  @ApiOperation({ summary: '更新签到奖励配置' })
  async updateConfig(@Body() body: Array<{ id?: number; day: number; number: number; type: number; status: number; sort: number }>) {
    const result = await this.signService.updateConfig(body);
    return { status: 200, message: '更新成功', data: result };
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除签到奖励配置' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.signService.delete(id);
    return { status: 200, message: '删除成功' };
  }
}
