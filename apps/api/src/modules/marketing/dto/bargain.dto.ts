import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBargainDto {
  @ApiProperty({ description: '活动标题' })
  @IsString()
  @IsNotEmpty({ message: '请输入活动标题' })
  title!: string;

  @ApiPropertyOptional({ description: '活动图片' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ description: '商品ID' })
  @IsNumber()
  product_id!: number;

  @ApiProperty({ description: '底价' })
  @IsNumber()
  price!: number;

  @ApiProperty({ description: '商品原价' })
  @IsNumber()
  product_price!: number;

  @ApiProperty({ description: '最低砍价金额' })
  @IsNumber()
  min_price!: number;

  @ApiProperty({ description: '砍价库存' })
  @IsNumber()
  bargain_stock!: number;

  @ApiPropertyOptional({ description: '限购数量' })
  @IsOptional()
  @IsNumber()
  quota?: number;

  @ApiProperty({ description: '开始时间' })
  @IsNumber()
  start_time!: number;

  @ApiProperty({ description: '结束时间' })
  @IsNumber()
  end_time!: number;

  @ApiPropertyOptional({ description: '活动规则' })
  @IsOptional()
  @IsString()
  rule?: string;

  @ApiPropertyOptional({ description: '排序' })
  @IsOptional()
  @IsNumber()
  sort?: number;

  @ApiPropertyOptional({ description: '状态' })
  @IsOptional()
  @IsNumber()
  status?: number;
}

export class UpdateBargainDto {
  @ApiPropertyOptional({ description: '活动标题' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: '活动图片' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ description: '商品ID' })
  @IsOptional()
  @IsNumber()
  product_id?: number;

  @ApiPropertyOptional({ description: '底价' })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({ description: '商品原价' })
  @IsOptional()
  @IsNumber()
  product_price?: number;

  @ApiPropertyOptional({ description: '最低砍价金额' })
  @IsOptional()
  @IsNumber()
  min_price?: number;

  @ApiPropertyOptional({ description: '砍价库存' })
  @IsOptional()
  @IsNumber()
  bargain_stock?: number;

  @ApiPropertyOptional({ description: '限购数量' })
  @IsOptional()
  @IsNumber()
  quota?: number;

  @ApiPropertyOptional({ description: '开始时间' })
  @IsOptional()
  @IsNumber()
  start_time?: number;

  @ApiPropertyOptional({ description: '结束时间' })
  @IsOptional()
  @IsNumber()
  end_time?: number;

  @ApiPropertyOptional({ description: '活动规则' })
  @IsOptional()
  @IsString()
  rule?: string;

  @ApiPropertyOptional({ description: '状态' })
  @IsOptional()
  @IsNumber()
  status?: number;

  @ApiPropertyOptional({ description: '排序' })
  @IsOptional()
  @IsNumber()
  sort?: number;
}
