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
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/product.dto';

@ApiTags('商品分类')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('product/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('list')
  @ApiOperation({ summary: '分类列表' })
  async getList(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('name') name?: string,
  ) {
    const result = await this.categoryService.getList({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      name,
    });
    return { status: 200, message: '获取成功', data: result };
  }

  @Get('all')
  @ApiOperation({ summary: '所有分类（树形）' })
  async getAll() {
    const result = await this.categoryService.getAll();
    return { status: 200, message: '获取成功', data: result };
  }

  @Get(':id')
  @ApiOperation({ summary: '分类详情' })
  async getDetail(@Param('id', ParseIntPipe) id: number) {
    const result = await this.categoryService.getDetail(id);
    return { status: 200, message: '获取成功', data: result };
  }

  @Post()
  @ApiOperation({ summary: '创建分类' })
  async create(@Body() dto: CreateCategoryDto) {
    const result = await this.categoryService.create(dto);
    return { status: 200, message: '创建成功', data: result };
  }

  @Put(':id')
  @ApiOperation({ summary: '更新分类' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
  ) {
    const result = await this.categoryService.update(id, dto);
    return { status: 200, message: '更新成功', data: result };
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除分类' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.categoryService.delete(id);
    return { status: 200, message: '删除成功' };
  }
}
