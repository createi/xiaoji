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
import { UserLevelService } from './user-level.service';
import { CreateUserLevelDto, UpdateUserLevelDto } from './dto/user.dto';

@ApiTags('用户等级')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user/level')
export class UserLevelController {
  constructor(private readonly userLevelService: UserLevelService) {}

  @Get('list')
  @ApiOperation({ summary: '等级列表' })
  async getList(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('name') name?: string,
  ) {
    const result = await this.userLevelService.getList({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      name,
    });
    return { status: 200, message: '获取成功', data: result };
  }

  @Get('all')
  @ApiOperation({ summary: '所有等级（下拉选择）' })
  async getAll() {
    const result = await this.userLevelService.getAll();
    return { status: 200, message: '获取成功', data: result };
  }

  @Get(':id')
  @ApiOperation({ summary: '等级详情' })
  async getDetail(@Param('id', ParseIntPipe) id: number) {
    const result = await this.userLevelService.getDetail(id);
    return { status: 200, message: '获取成功', data: result };
  }

  @Post()
  @ApiOperation({ summary: '创建等级' })
  async create(@Body() dto: CreateUserLevelDto) {
    const result = await this.userLevelService.create(dto);
    return { status: 200, message: '创建成功', data: result };
  }

  @Put(':id')
  @ApiOperation({ summary: '更新等级' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserLevelDto,
  ) {
    const result = await this.userLevelService.update(id, dto);
    return { status: 200, message: '更新成功', data: result };
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除等级' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.userLevelService.delete(id);
    return { status: 200, message: '删除成功' };
  }
}
