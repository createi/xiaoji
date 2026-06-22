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
import { DiyService } from './diy.service';

@ApiTags('DIY管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('diy')
export class DiyController {
  constructor(private readonly diyService: DiyService) {}

  @Get('list')
  @ApiOperation({ summary: 'DIY列表' })
  async getList(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('name') name?: string,
  ) {
    const result = await this.diyService.getList({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      name,
    });
    return {
      status: 200,
      message: '获取成功',
      data: result,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'DIY详情' })
  async getDetail(@Param('id', ParseIntPipe) id: number) {
    const result = await this.diyService.getDetail(id);
    return {
      status: 200,
      message: '获取成功',
      data: result,
    };
  }

  @Post()
  @ApiOperation({ summary: '创建DIY' })
  async create(
    @Body()
    body: {
      name: string;
      description?: string;
      content?: string;
      isDefault?: number;
      status?: number;
    },
  ) {
    const result = await this.diyService.create(body);
    return {
      status: 200,
      message: '创建成功',
      data: result,
    };
  }

  @Put(':id')
  @ApiOperation({ summary: '更新DIY' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: {
      name?: string;
      description?: string;
      content?: string;
      isDefault?: number;
      status?: number;
    },
  ) {
    const result = await this.diyService.update(id, body);
    return {
      status: 200,
      message: '更新成功',
      data: result,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除DIY' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.diyService.delete(id);
    return {
      status: 200,
      message: '删除成功',
    };
  }
}
