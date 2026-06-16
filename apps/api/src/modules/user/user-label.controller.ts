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
import { UserLabelService } from './user-label.service';
import { CreateUserLabelDto, UpdateUserLabelDto } from './dto/user.dto';

@ApiTags('用户标签')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user/label')
export class UserLabelController {
  constructor(private readonly userLabelService: UserLabelService) {}

  @Get('list')
  @ApiOperation({ summary: '标签列表' })
  async getList(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('name') name?: string,
  ) {
    const result = await this.userLabelService.getList({ page, limit, name });
    return { status: 200, message: '获取成功', data: result };
  }

  @Get('all')
  @ApiOperation({ summary: '所有标签（下拉选择）' })
  async getAll() {
    const result = await this.userLabelService.getAll();
    return { status: 200, message: '获取成功', data: result };
  }

  @Get(':id')
  @ApiOperation({ summary: '标签详情' })
  async getDetail(@Param('id', ParseIntPipe) id: number) {
    const result = await this.userLabelService.getDetail(id);
    return { status: 200, message: '获取成功', data: result };
  }

  @Post()
  @ApiOperation({ summary: '创建标签' })
  async create(@Body() dto: CreateUserLabelDto) {
    const result = await this.userLabelService.create(dto);
    return { status: 200, message: '创建成功', data: result };
  }

  @Put(':id')
  @ApiOperation({ summary: '更新标签' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserLabelDto,
  ) {
    const result = await this.userLabelService.update(id, dto);
    return { status: 200, message: '更新成功', data: result };
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除标签' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.userLabelService.delete(id);
    return { status: 200, message: '删除成功' };
  }
}
