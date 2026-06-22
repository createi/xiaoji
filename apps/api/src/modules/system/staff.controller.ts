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
import { StaffService } from './staff.service';

@ApiTags('店员管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('system/staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get('list')
  @ApiOperation({ summary: '店员列表' })
  async getList(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('store_id') storeId?: string,
    @Query('keywords') keywords?: string,
  ) {
    const result = await this.staffService.getList({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 15,
      storeId: storeId ? Number(storeId) : undefined,
      keywords,
    });
    return {
      status: 200,
      message: '获取成功',
      data: result,
    };
  }

  @Post()
  @ApiOperation({ summary: '添加店员' })
  async create(@Body() body: { uid: number; store_id: number; role?: string }) {
    const result = await this.staffService.create(body);
    return {
      status: 200,
      message: '添加成功',
      data: result,
    };
  }

  @Put(':id')
  @ApiOperation({ summary: '更新店员' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { role?: string; status?: number; store_id?: number },
  ) {
    const result = await this.staffService.update(id, body);
    return {
      status: 200,
      message: '更新成功',
      data: result,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除店员' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.staffService.delete(id);
    return {
      status: 200,
      message: '删除成功',
    };
  }
}
