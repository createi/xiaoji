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
import { StoreService } from './store.service';

@ApiTags('门店管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('system/store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get('list')
  @ApiOperation({ summary: '门店列表' })
  async getList(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('keywords') keywords?: string,
  ) {
    const result = await this.storeService.getList({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 15,
      keywords,
    });
    return {
      status: 200,
      message: '获取成功',
      data: result,
    };
  }

  @Get('all')
  @ApiOperation({ summary: '所有门店（下拉选择）' })
  async getAll() {
    const result = await this.storeService.getAll();
    return {
      status: 200,
      message: '获取成功',
      data: result,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: '门店详情' })
  async getDetail(@Param('id', ParseIntPipe) id: number) {
    const result = await this.storeService.getDetail(id);
    return {
      status: 200,
      message: '获取成功',
      data: result,
    };
  }

  @Post()
  @ApiOperation({ summary: '创建门店' })
  async create(@Body() body: any) {
    const result = await this.storeService.create(body);
    return {
      status: 200,
      message: '创建成功',
      data: result,
    };
  }

  @Put(':id')
  @ApiOperation({ summary: '更新门店' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
  ) {
    const result = await this.storeService.update(id, body);
    return {
      status: 200,
      message: '更新成功',
      data: result,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除门店' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.storeService.delete(id);
    return {
      status: 200,
      message: '删除成功',
    };
  }
}
