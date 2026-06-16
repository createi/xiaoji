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
import { ProductService } from './product.service';
import { QueryProductDto, CreateProductDto, UpdateProductDto } from './dto/product.dto';

@ApiTags('商品管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('list')
  @ApiOperation({ summary: '商品列表' })
  async getList(@Query() query: QueryProductDto) {
    const result = await this.productService.getList(query);
    return { status: 200, message: '获取成功', data: result };
  }

  @Get(':id')
  @ApiOperation({ summary: '商品详情' })
  async getDetail(@Param('id', ParseIntPipe) id: number) {
    const result = await this.productService.getDetail(id);
    return { status: 200, message: '获取成功', data: result };
  }

  @Post()
  @ApiOperation({ summary: '创建商品' })
  async create(@Body() dto: CreateProductDto) {
    const result = await this.productService.create(dto);
    return { status: 200, message: '创建成功', data: result };
  }

  @Put(':id')
  @ApiOperation({ summary: '更新商品' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ) {
    const result = await this.productService.update(id, dto);
    return { status: 200, message: '更新成功', data: result };
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除商品' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.productService.delete(id);
    return { status: 200, message: '删除成功' };
  }

  @Put(':id/status')
  @ApiOperation({ summary: '设置商品状态' })
  async setStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('is_show', ParseIntPipe) is_show: number,
  ) {
    const result = await this.productService.setStatus(id, is_show);
    return { status: 200, message: '设置成功', data: result };
  }
}
