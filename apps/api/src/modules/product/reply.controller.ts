import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReplyService } from './reply.service';
import { ReplyProductDto } from './dto/product.dto';

@ApiTags('商品评价')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('product/reply')
export class ReplyController {
  constructor(private readonly replyService: ReplyService) {}

  @Get('list')
  @ApiOperation({ summary: '评价列表' })
  async getList(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('product_id') product_id?: string,
    @Query('status') status?: string,
  ) {
    const result = await this.replyService.getList({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      product_id: product_id ? Number(product_id) : undefined,
      status: status ? Number(status) : undefined,
    });
    return { status: 200, message: '获取成功', data: result };
  }

  @Post(':id/reply')
  @ApiOperation({ summary: '回复评价' })
  async reply(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ReplyProductDto,
  ) {
    const result = await this.replyService.reply(id, dto.reply);
    return { status: 200, message: '回复成功', data: result };
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除评价' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.replyService.delete(id);
    return { status: 200, message: '删除成功' };
  }
}
