import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ConfigService } from './config.service';

@ApiTags('系统配置')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('system/config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get('tabs')
  @ApiOperation({ summary: '获取配置分类列表' })
  async getTabs() {
    const result = await this.configService.getTabs();
    return {
      status: 200,
      message: '获取成功',
      data: result,
    };
  }

  @Get()
  @ApiOperation({ summary: '获取配置列表' })
  async getList() {
    const result = await this.configService.getList();
    return {
      status: 200,
      message: '获取成功',
      data: result,
    };
  }

  @Get(':tabId')
  @ApiOperation({ summary: '获取指定分类的配置' })
  async getByTabId(@Param('tabId', ParseIntPipe) tabId: number) {
    const result = await this.configService.getByTabId(tabId);
    return {
      status: 200,
      message: '获取成功',
      data: result,
    };
  }

  @Post()
  @ApiOperation({ summary: '保存配置' })
  async save(@Body() body: { tabId?: number; configs: Record<string, string> }) {
    await this.configService.save(body);
    return {
      status: 200,
      message: '保存成功',
    };
  }
}
