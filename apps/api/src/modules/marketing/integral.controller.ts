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
import { IntegralService } from './integral.service';
import { CreateIntegralDto, UpdateIntegralDto } from './dto/integral.dto';

@ApiTags('积分商品管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('marketing/integral')
export class IntegralController {
  constructor(private readonly integralService: IntegralService) {}

  @Get('list')
  @ApiOperation({ summary: '积分商品列表' })
  async getList(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('title') title?: string,
    @Query('status') status?: number,
  ) {
    const result = await this.integralService.getList({ page, limit, title, status });
    return { status: 200, message: '获取成功', data: result };
  }

  @Get(':id')
  @ApiOperation({ summary: '积分商品详情' })
  async getDetail(@Param('id', ParseIntPipe) id: number) {
    const result = await this.integralService.getDetail(id);
    return { status: 200, message: '获取成功', data: result };
  }

  @Post()
  @ApiOperation({ summary: '创建积分商品' })
  async create(@Body() dto: CreateIntegralDto) {
    const result = await this.integralService.create(dto);
    return { status: 200, message: '创建成功', data: result };
  }

  @Put(':id')
  @ApiOperation({ summary: '更新积分商品' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateIntegralDto) {
    const result = await this.integralService.update(id, dto);
    return { status: 200, message: '更新成功', data: result };
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除积分商品' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.integralService.delete(id);
    return { status: 200, message: '删除成功' };
  }
}
