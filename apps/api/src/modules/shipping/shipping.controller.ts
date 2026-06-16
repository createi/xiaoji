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
import { TemplateService } from './template.service';
import { ExpressService } from './express.service';
import {
  CreateTemplateDto,
  UpdateTemplateDto,
  CreateExpressDto,
  UpdateExpressDto,
} from './dto/shipping.dto';

@ApiTags('物流管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('shipping')
export class ShippingController {
  constructor(
    private readonly templateService: TemplateService,
    private readonly expressService: ExpressService,
  ) {}

  // 运费模板
  @Get('template/list')
  @ApiOperation({ summary: '运费模板列表' })
  async getTemplateList(@Query('page') page?: number, @Query('limit') limit?: number) {
    const result = await this.templateService.getList({ page, limit });
    return { status: 200, message: '获取成功', data: result };
  }

  @Get('template/:id')
  @ApiOperation({ summary: '运费模板详情' })
  async getTemplateDetail(@Param('id', ParseIntPipe) id: number) {
    const result = await this.templateService.getDetail(id);
    return { status: 200, message: '获取成功', data: result };
  }

  @Post('template')
  @ApiOperation({ summary: '创建运费模板' })
  async createTemplate(@Body() dto: CreateTemplateDto) {
    const result = await this.templateService.create(dto);
    return { status: 200, message: '创建成功', data: result };
  }

  @Put('template/:id')
  @ApiOperation({ summary: '更新运费模板' })
  async updateTemplate(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTemplateDto) {
    const result = await this.templateService.update(id, dto);
    return { status: 200, message: '更新成功', data: result };
  }

  @Delete('template/:id')
  @ApiOperation({ summary: '删除运费模板' })
  async deleteTemplate(@Param('id', ParseIntPipe) id: number) {
    await this.templateService.delete(id);
    return { status: 200, message: '删除成功' };
  }

  // 快递公司
  @Get('express/list')
  @ApiOperation({ summary: '快递公司列表' })
  async getExpressList(@Query('page') page?: number, @Query('limit') limit?: number) {
    const result = await this.expressService.getList({ page, limit });
    return { status: 200, message: '获取成功', data: result };
  }

  @Get('express/all')
  @ApiOperation({ summary: '所有快递公司' })
  async getAllExpress() {
    const result = await this.expressService.getAll();
    return { status: 200, message: '获取成功', data: result };
  }

  @Get('express/:id')
  @ApiOperation({ summary: '快递公司详情' })
  async getExpressDetail(@Param('id', ParseIntPipe) id: number) {
    const result = await this.expressService.getDetail(id);
    return { status: 200, message: '获取成功', data: result };
  }

  @Post('express')
  @ApiOperation({ summary: '创建快递公司' })
  async createExpress(@Body() dto: CreateExpressDto) {
    const result = await this.expressService.create(dto);
    return { status: 200, message: '创建成功', data: result };
  }

  @Put('express/:id')
  @ApiOperation({ summary: '更新快递公司' })
  async updateExpress(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateExpressDto) {
    const result = await this.expressService.update(id, dto);
    return { status: 200, message: '更新成功', data: result };
  }

  @Delete('express/:id')
  @ApiOperation({ summary: '删除快递公司' })
  async deleteExpress(@Param('id', ParseIntPipe) id: number) {
    await this.expressService.delete(id);
    return { status: 200, message: '删除成功' };
  }
}
