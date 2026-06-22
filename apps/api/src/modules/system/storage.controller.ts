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
import { StorageService } from './storage.service';

@ApiTags('存储管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('system/storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get('list')
  @ApiOperation({ summary: '存储列表' })
  async getList(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.storageService.getList({
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
  @ApiOperation({ summary: '创建存储配置' })
  async create(
    @Body()
    body: {
      name: string;
      bucket?: string;
      endpoint?: string;
      domain?: string;
      region?: string;
    },
  ) {
    const result = await this.storageService.create(body);
    return {
      status: 200,
      message: '创建成功',
      data: result,
    };
  }

  @Put(':id')
  @ApiOperation({ summary: '更新存储配置' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: {
      name?: string;
      bucket?: string;
      endpoint?: string;
      domain?: string;
      region?: string;
    },
  ) {
    const result = await this.storageService.update(id, body);
    return {
      status: 200,
      message: '更新成功',
      data: result,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除存储配置' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.storageService.delete(id);
    return {
      status: 200,
      message: '删除成功',
    };
  }
}
