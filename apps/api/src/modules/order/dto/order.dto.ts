import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class QueryOrderDto {
  @ApiPropertyOptional({ description: '页码' })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({ description: '每页数量' })
  @IsOptional()
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional({ description: '订单状态' })
  @IsOptional()
  @IsNumber()
  status?: number;

  @ApiPropertyOptional({ description: '订单类型' })
  @IsOptional()
  @IsNumber()
  type?: number;

  @ApiPropertyOptional({ description: '搜索类型: all/order_id/uid/real_name/user_phone/title' })
  @IsOptional()
  @IsString()
  search_type?: string;

  @ApiPropertyOptional({ description: '搜索关键词' })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({ description: '开始时间' })
  @IsOptional()
  @IsString()
  start_time?: string;

  @ApiPropertyOptional({ description: '结束时间' })
  @IsOptional()
  @IsString()
  end_time?: string;
}

export class UpdateOrderDto {
  @ApiPropertyOptional({ description: '商家备注' })
  @IsOptional()
  @IsString()
  remark?: string;

  @ApiPropertyOptional({ description: '收货人姓名' })
  @IsOptional()
  @IsString()
  real_name?: string;

  @ApiPropertyOptional({ description: '收货人手机号' })
  @IsOptional()
  @IsString()
  user_phone?: string;

  @ApiPropertyOptional({ description: '收货地址' })
  @IsOptional()
  @IsString()
  user_address?: string;
}

export class ShipOrderDto {
  @ApiProperty({ description: '快递公司' })
  @IsString()
  delivery_name: string;

  @ApiProperty({ description: '快递单号' })
  @IsString()
  delivery_id: string;

  @ApiPropertyOptional({ description: '快递公司编码' })
  @IsOptional()
  @IsString()
  delivery_type?: string;
}

export class RefundOrderDto {
  @ApiProperty({ description: '退款原因' })
  @IsString()
  refund_reason: string;

  @ApiPropertyOptional({ description: '退款说明' })
  @IsOptional()
  @IsString()
  refund_explain?: string;

  @ApiPropertyOptional({ description: '退款凭证图片 JSON' })
  @IsOptional()
  @IsString()
  refund_img?: string;
}
