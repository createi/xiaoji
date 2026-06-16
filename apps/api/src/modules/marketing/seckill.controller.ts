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
import { SeckillService } from './seckill.service';
import { CreateSeckillDto, UpdateSeckillDto } from './dto/seckill.dto';

@ApiTags('秒杀活动管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('marketing/seckill')
export class SeckillController {
  constructor(private readonly seckillService: SeckillService) {}

  @Get('list')
  @ApiOperation({ summary: '秒杀活动列表' })
  async getList(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('title') title?: string,
    @Query('status') status?: string,
  ) {
    const result = await this.seckillService.getList({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      title,
      status: status ? Number(status) : undefined,
    });
    return { status: 200, message: '获取成功', data: result };
  }

  @Get(':id')
  @ApiOperation({ summary: '秒杀活动详情' })
  async getDetail(@Param('id', ParseIntPipe) id: number) {
    const result = await this.seckillService.getDetail(id);
    return { status: 200, message: '获取成功', data: result };
  }

  @Post()
  @ApiOperation({ summary: '创建秒杀活动' })
  async create(@Body() dto: CreateSeckillDto) {
    const result = await this.seckillService.create(dto);
    return { status: 200, message: '创建成功', data: result };
  }

  @Put(':id')
  @ApiOperation({ summary: '更新秒杀活动' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSeckillDto) {
    const result = await this.seckillService.update(id, dto);
    return { status: 200, message: '更新成功', data: result };
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除秒杀活动' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.seckillService.delete(id);
    return { status: 200, message: '删除成功' };
  }
}
