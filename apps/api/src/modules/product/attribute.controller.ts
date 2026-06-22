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
import { AttributeService } from './attribute.service';

@ApiTags('商品属性')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('product/attr')
export class AttributeController {
  constructor(private readonly attributeService: AttributeService) {}

  @Get('list')
  @ApiOperation({ summary: '属性列表' })
  async getList(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.attributeService.getList({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
    return {
      status: 200,
      message: '获取成功',
      data: result,
    };
  }

  @Post()
  @ApiOperation({ summary: '创建属性' })
  async create(
    @Body()
    body: {
      productId: number;
      valueName: string;
      resultType?: string;
      sort?: number;
      image?: string;
    },
  ) {
    const result = await this.attributeService.create(body);
    return {
      status: 200,
      message: '创建成功',
      data: result,
    };
  }

  @Put(':id')
  @ApiOperation({ summary: '更新属性' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: {
      productId?: number;
      valueName?: string;
      resultType?: string;
      sort?: number;
      image?: string;
    },
  ) {
    const result = await this.attributeService.update(id, body);
    return {
      status: 200,
      message: '更新成功',
      data: result,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除属性' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.attributeService.delete(id);
    return {
      status: 200,
      message: '删除成功',
    };
  }
}
