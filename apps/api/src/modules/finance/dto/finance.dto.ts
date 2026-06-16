import { IsOptional, IsNumber, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryBillDto {
  @ApiPropertyOptional({ description: '页码' })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({ description: '每页数量' })
  @IsOptional()
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional({ description: '类型: 1=充值 2=消费 3=提现 4=佣金 5=其他' })
  @IsOptional()
  @IsNumber()
  type?: number;

  @ApiPropertyOptional({ description: '开始时间' })
  @IsOptional()
  @IsString()
  start_time?: string;

  @ApiPropertyOptional({ description: '结束时间' })
  @IsOptional()
  @IsString()
  end_time?: string;
}

export class QueryExtractDto {
  @ApiPropertyOptional({ description: '页码' })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({ description: '每页数量' })
  @IsOptional()
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional({ description: '状态: 0=待审核 1=审核通过 2=已提现 3=审核失败' })
  @IsOptional()
  @IsNumber()
  status?: number;

  @ApiPropertyOptional({ description: '关键词' })
  @IsOptional()
  @IsString()
  keyword?: string;
}

export class AuditExtractDto {
  @ApiPropertyOptional({ description: '审核状态: 1=通过 3=拒绝' })
  @IsNumber()
  status!: number;

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  mark?: string;
}
