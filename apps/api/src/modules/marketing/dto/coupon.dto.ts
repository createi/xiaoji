import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCouponDto {
  @ApiProperty({ description: '优惠券名称' })
  @IsString()
  @IsNotEmpty({ message: '请输入优惠券名称' })
  title!: string;

  @ApiProperty({ description: '类型: 1=满减 2=折扣 3=无门槛', example: 1 })
  @IsNumber()
  type!: number;

  @ApiProperty({ description: '面值/折扣' })
  @IsNumber()
  value!: number;

  @ApiPropertyOptional({ description: '使用门槛' })
  @IsOptional()
  @IsNumber()
  min_price?: number;

  @ApiPropertyOptional({ description: '使用类型: 1=全场 2=指定分类 3=指定商品' })
  @IsOptional()
  @IsNumber()
  use_type?: number;

  @ApiPropertyOptional({ description: '分类ID列表' })
  @IsOptional()
  @IsString()
  category_ids?: string;

  @ApiPropertyOptional({ description: '商品ID列表' })
  @IsOptional()
  @IsString()
  product_ids?: string;

  @ApiPropertyOptional({ description: '开始时间' })
  @IsOptional()
  @IsNumber()
  start_time?: number;

  @ApiPropertyOptional({ description: '结束时间' })
  @IsOptional()
  @IsNumber()
  end_time?: number;
}

export class UpdateCouponDto {
  @ApiPropertyOptional({ description: '优惠券名称' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: '类型: 1=满减 2=折扣 3=无门槛' })
  @IsOptional()
  @IsNumber()
  type?: number;

  @ApiPropertyOptional({ description: '面值/折扣' })
  @IsOptional()
  @IsNumber()
  value?: number;

  @ApiPropertyOptional({ description: '使用门槛' })
  @IsOptional()
  @IsNumber()
  min_price?: number;

  @ApiPropertyOptional({ description: '使用类型' })
  @IsOptional()
  @IsNumber()
  use_type?: number;

  @ApiPropertyOptional({ description: '分类ID列表' })
  @IsOptional()
  @IsString()
  category_ids?: string;

  @ApiPropertyOptional({ description: '商品ID列表' })
  @IsOptional()
  @IsString()
  product_ids?: string;

  @ApiPropertyOptional({ description: '开始时间' })
  @IsOptional()
  @IsNumber()
  start_time?: number;

  @ApiPropertyOptional({ description: '结束时间' })
  @IsOptional()
  @IsNumber()
  end_time?: number;

  @ApiPropertyOptional({ description: '状态' })
  @IsOptional()
  @IsNumber()
  status?: number;
}
