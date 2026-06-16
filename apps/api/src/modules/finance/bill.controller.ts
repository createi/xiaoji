import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BillService } from './bill.service';
import { QueryBillDto } from './dto/finance.dto';

@ApiTags('余额记录')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('finance/bill')
export class BillController {
  constructor(private readonly billService: BillService) {}

  @Get('list')
  @ApiOperation({ summary: '余额记录列表' })
  async getList(@Query() query: QueryBillDto) {
    const result = await this.billService.getList(query);
    return { status: 200, message: '获取成功', data: result };
  }

  @Get(':id')
  @ApiOperation({ summary: '余额记录详情' })
  async getDetail(@Param('id', ParseIntPipe) id: number) {
    const result = await this.billService.getDetail(id);
    return { status: 200, message: '获取成功', data: result };
  }
}
