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
import { MenuService } from './menu.service';

@ApiTags('菜单管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('system/menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get('list')
  @ApiOperation({ summary: '菜单列表' })
  async getList(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('title') title?: string,
  ) {
    const result = await this.menuService.getList({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      title,
    });
    return {
      status: 200,
      message: '获取成功',
      data: result,
    };
  }

  @Get('all')
  @ApiOperation({ summary: '所有菜单（权限选择）' })
  async getAll() {
    const result = await this.menuService.getAll();
    return {
      status: 200,
      message: '获取成功',
      data: result,
    };
  }

  @Post()
  @ApiOperation({ summary: '创建菜单' })
  async create(
    @Body()
    body: {
      pid?: number;
      title: string;
      icon?: string;
      path?: string;
      component?: string;
      sort?: number;
      status?: number;
      is_show?: number;
    },
  ) {
    const result = await this.menuService.create(body);
    return {
      status: 200,
      message: '创建成功',
      data: result,
    };
  }

  @Put(':id')
  @ApiOperation({ summary: '更新菜单' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: {
      pid?: number;
      title?: string;
      icon?: string;
      path?: string;
      component?: string;
      sort?: number;
      status?: number;
      is_show?: number;
    },
  ) {
    const result = await this.menuService.update(id, body);
    return {
      status: 200,
      message: '更新成功',
      data: result,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除菜单' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.menuService.delete(id);
    return {
      status: 200,
      message: '删除成功',
    };
  }
}
