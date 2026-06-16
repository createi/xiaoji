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
import { RoleService } from './role.service';

@ApiTags('角色管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('system/role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('list')
  @ApiOperation({ summary: '角色列表' })
  async getList(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('name') name?: string,
  ) {
    const result = await this.roleService.getList({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      name,
    });
    return {
      status: 200,
      message: '获取成功',
      data: result,
    };
  }

  @Get('all')
  @ApiOperation({ summary: '所有角色（下拉选择）' })
  async getAll() {
    const result = await this.roleService.getAll();
    return {
      status: 200,
      message: '获取成功',
      data: result,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: '角色详情' })
  async getDetail(@Param('id', ParseIntPipe) id: number) {
    const result = await this.roleService.getDetail(id);
    return {
      status: 200,
      message: '获取成功',
      data: result,
    };
  }

  @Post()
  @ApiOperation({ summary: '创建角色' })
  async create(@Body() body: { name: string; status?: number; rules?: number[] }) {
    const result = await this.roleService.create(body);
    return {
      status: 200,
      message: '创建成功',
      data: result,
    };
  }

  @Put(':id')
  @ApiOperation({ summary: '更新角色' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { name?: string; status?: number; rules?: number[] },
  ) {
    const result = await this.roleService.update(id, body);
    return {
      status: 200,
      message: '更新成功',
      data: result,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除角色' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.roleService.delete(id);
    return {
      status: 200,
      message: '删除成功',
    };
  }
}
