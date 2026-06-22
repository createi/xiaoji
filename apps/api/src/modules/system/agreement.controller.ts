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
import { AgreementService } from './agreement.service';

@ApiTags('协议管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('system/agreement')
export class AgreementController {
  constructor(private readonly agreementService: AgreementService) {}

  @Get('list')
  @ApiOperation({ summary: '协议列表' })
  async getList(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('title') title?: string,
  ) {
    const result = await this.agreementService.getList({
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

  @Get(':id')
  @ApiOperation({ summary: '协议详情' })
  async getDetail(@Param('id', ParseIntPipe) id: number) {
    const result = await this.agreementService.getDetail(id);
    return {
      status: 200,
      message: '获取成功',
      data: result,
    };
  }

  @Post()
  @ApiOperation({ summary: '创建协议' })
  async create(
    @Body() body: { title: string; content: string; status?: number },
  ) {
    const result = await this.agreementService.create(body);
    return {
      status: 200,
      message: '创建成功',
      data: result,
    };
  }

  @Put(':id')
  @ApiOperation({ summary: '更新协议' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { title?: string; content?: string; status?: number },
  ) {
    const result = await this.agreementService.update(id, body);
    return {
      status: 200,
      message: '更新成功',
      data: result,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除协议' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.agreementService.delete(id);
    return {
      status: 200,
      message: '删除成功',
    };
  }
}
