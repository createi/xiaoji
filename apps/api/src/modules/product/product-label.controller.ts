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
import { ProductLabelService } from './product-label.service';
import { CreateProductLabelDto, UpdateProductLabelDto } from './dto/product.dto';

@ApiTags('商品标签')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('product/label')
export class ProductLabelController {
  constructor(private readonly productLabelService: ProductLabelService) {}

  @Get('list')
  @ApiOperation({ summary: '标签列表' })
  async getList(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('name') name?: string,
  ) {
    const result = await this.productLabelService.getList({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      name,
    });
    return { status: 200, message: '获取成功', data: result };
  }

  @Get('all')
  @ApiOperation({ summary: '所有标签（下拉选择）' })
  async getAll() {
    const result = await this.productLabelService.getAll();
    return { status: 200, message: '获取成功', data: result };
  }

  @Get(':id')
  @ApiOperation({ summary: '标签详情' })
  async getDetail(@Param('id', ParseIntPipe) id: number) {
    const result = await this.productLabelService.getDetail(id);
    return { status: 200, message: '获取成功', data: result };
  }

  @Post()
  @ApiOperation({ summary: '创建标签' })
  async create(@Body() dto: CreateProductLabelDto) {
    const result = await this.productLabelService.create(dto);
    return { status: 200, message: '创建成功', data: result };
  }

  @Put(':id')
  @ApiOperation({ summary: '更新标签' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductLabelDto,
  ) {
    const result = await this.productLabelService.update(id, dto);
    return { status: 200, message: '更新成功', data: result };
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除标签' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.productLabelService.delete(id);
    return { status: 200, message: '删除成功' };
  }
}
