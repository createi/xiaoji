import {
  Controller,
  Get,
  Put,
  Param,
  Query,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ExtractService } from './extract.service';
import { QueryExtractDto, AuditExtractDto } from './dto/finance.dto';

@ApiTags('提现管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('finance/extract')
export class ExtractController {
  constructor(private readonly extractService: ExtractService) {}

  @Get('list')
  @ApiOperation({ summary: '提现记录列表' })
  async getList(@Query() query: QueryExtractDto) {
    const result = await this.extractService.getList(query);
    return { status: 200, message: '获取成功', data: result };
  }

  @Get(':id')
  @ApiOperation({ summary: '提现记录详情' })
  async getDetail(@Param('id', ParseIntPipe) id: number) {
    const result = await this.extractService.getDetail(id);
    return { status: 200, message: '获取成功', data: result };
  }

  @Put(':id/audit')
  @ApiOperation({ summary: '审核提现' })
  async audit(@Param('id', ParseIntPipe) id: number, @Body() dto: AuditExtractDto) {
    const result = await this.extractService.audit(id, dto);
    return { status: 200, message: '审核成功', data: result };
  }
}
