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
import { BargainService } from './bargain.service';
import { CreateBargainDto, UpdateBargainDto } from './dto/bargain.dto';

@ApiTags('砍价活动管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('marketing/bargain')
export class BargainController {
  constructor(private readonly bargainService: BargainService) {}

  @Get('list')
  @ApiOperation({ summary: '砍价活动列表' })
  async getList(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('title') title?: string,
    @Query('status') status?: number,
  ) {
    const result = await this.bargainService.getList({ page, limit, title, status });
    return { status: 200, message: '获取成功', data: result };
  }

  @Get(':id')
  @ApiOperation({ summary: '砍价活动详情' })
  async getDetail(@Param('id', ParseIntPipe) id: number) {
    const result = await this.bargainService.getDetail(id);
    return { status: 200, message: '获取成功', data: result };
  }

  @Post()
  @ApiOperation({ summary: '创建砍价活动' })
  async create(@Body() dto: CreateBargainDto) {
    const result = await this.bargainService.create(dto);
    return { status: 200, message: '创建成功', data: result };
  }

  @Put(':id')
  @ApiOperation({ summary: '更新砍价活动' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBargainDto) {
    const result = await this.bargainService.update(id, dto);
    return { status: 200, message: '更新成功', data: result };
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除砍价活动' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.bargainService.delete(id);
    return { status: 200, message: '删除成功' };
  }
}
