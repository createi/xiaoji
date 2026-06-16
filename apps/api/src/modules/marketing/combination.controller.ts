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
import { CombinationService } from './combination.service';
import { CreateCombinationDto, UpdateCombinationDto } from './dto/combination.dto';

@ApiTags('拼团活动管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('marketing/combination')
export class CombinationController {
  constructor(private readonly combinationService: CombinationService) {}

  @Get('list')
  @ApiOperation({ summary: '拼团活动列表' })
  async getList(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('title') title?: string,
    @Query('is_show') is_show?: number,
  ) {
    const result = await this.combinationService.getList({ page, limit, title, is_show });
    return { status: 200, message: '获取成功', data: result };
  }

  @Get(':id')
  @ApiOperation({ summary: '拼团活动详情' })
  async getDetail(@Param('id', ParseIntPipe) id: number) {
    const result = await this.combinationService.getDetail(id);
    return { status: 200, message: '获取成功', data: result };
  }

  @Post()
  @ApiOperation({ summary: '创建拼团活动' })
  async create(@Body() dto: CreateCombinationDto) {
    const result = await this.combinationService.create(dto);
    return { status: 200, message: '创建成功', data: result };
  }

  @Put(':id')
  @ApiOperation({ summary: '更新拼团活动' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCombinationDto) {
    const result = await this.combinationService.update(id, dto);
    return { status: 200, message: '更新成功', data: result };
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除拼团活动' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.combinationService.delete(id);
    return { status: 200, message: '删除成功' };
  }
}
