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
import { UserGroupService } from './user-group.service';
import { CreateUserGroupDto, UpdateUserGroupDto } from './dto/user.dto';

@ApiTags('用户分组')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user/group')
export class UserGroupController {
  constructor(private readonly userGroupService: UserGroupService) {}

  @Get('list')
  @ApiOperation({ summary: '分组列表' })
  async getList(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('name') name?: string,
  ) {
    const result = await this.userGroupService.getList({ page, limit, name });
    return { status: 200, message: '获取成功', data: result };
  }

  @Get('all')
  @ApiOperation({ summary: '所有分组（下拉选择）' })
  async getAll() {
    const result = await this.userGroupService.getAll();
    return { status: 200, message: '获取成功', data: result };
  }

  @Get(':id')
  @ApiOperation({ summary: '分组详情' })
  async getDetail(@Param('id', ParseIntPipe) id: number) {
    const result = await this.userGroupService.getDetail(id);
    return { status: 200, message: '获取成功', data: result };
  }

  @Post()
  @ApiOperation({ summary: '创建分组' })
  async create(@Body() dto: CreateUserGroupDto) {
    const result = await this.userGroupService.create(dto);
    return { status: 200, message: '创建成功', data: result };
  }

  @Put(':id')
  @ApiOperation({ summary: '更新分组' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserGroupDto,
  ) {
    const result = await this.userGroupService.update(id, dto);
    return { status: 200, message: '更新成功', data: result };
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除分组' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.userGroupService.delete(id);
    return { status: 200, message: '删除成功' };
  }
}
