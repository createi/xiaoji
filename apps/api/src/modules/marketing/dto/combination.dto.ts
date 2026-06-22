import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCombinationDto {
  @ApiProperty({ description: '活动标题' })
  @IsString()
  @IsNotEmpty({ message: '请输入活动标题' })
  title!: string;

  @ApiPropertyOptional({ description: '活动图片' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ description: '活动详情' })
  @IsOptional()
  @IsString()
  info?: string;

  @ApiProperty({ description: '商品ID' })
  @IsNumber()
  product_id!: number;

  @ApiProperty({ description: '拼团价格' })
  @IsNumber()
  price!: number;

  @ApiProperty({ description: '原价' })
  @IsNumber()
  ot_price!: number;

  @ApiProperty({ description: '成团人数' })
  @IsNumber()
  people_num!: number;

  @ApiProperty({ description: '总库存' })
  @IsNumber()
  total!: number;

  @ApiPropertyOptional({ description: '限购数量' })
  @IsOptional()
  @IsNumber()
  quota?: number;

  @ApiProperty({ description: '开始时间' })
  @IsString()
  start_time!: string;

  @ApiProperty({ description: '结束时间' })
  @IsString()
  end_time!: string;

  @ApiPropertyOptional({ description: '排序' })
  @IsOptional()
  @IsNumber()
  sort?: number;

  @ApiPropertyOptional({ description: '是否上架' })
  @IsOptional()
  @IsNumber()
  is_show?: number;
}

export class UpdateCombinationDto {
  @ApiPropertyOptional({ description: '活动标题' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: '活动图片' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ description: '活动详情' })
  @IsOptional()
  @IsString()
  info?: string;

  @ApiPropertyOptional({ description: '商品ID' })
  @IsOptional()
  @IsNumber()
  product_id?: number;

  @ApiPropertyOptional({ description: '拼团价格' })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({ description: '原价' })
  @IsOptional()
  @IsNumber()
  ot_price?: number;

  @ApiPropertyOptional({ description: '成团人数' })
  @IsOptional()
  @IsNumber()
  people_num?: number;

  @ApiPropertyOptional({ description: '总库存' })
  @IsOptional()
  @IsNumber()
  total?: number;

  @ApiPropertyOptional({ description: '限购数量' })
  @IsOptional()
  @IsNumber()
  quota?: number;

  @ApiPropertyOptional({ description: '开始时间' })
  @IsOptional()
  @IsString()
  start_time?: string;

  @ApiPropertyOptional({ description: '结束时间' })
  @IsOptional()
  @IsString()
  end_time?: string;

  @ApiPropertyOptional({ description: '状态' })
  @IsOptional()
  @IsNumber()
  status?: number;

  @ApiPropertyOptional({ description: '是否上架' })
  @IsOptional()
  @IsNumber()
  is_show?: number;

  @ApiPropertyOptional({ description: '排序' })
  @IsOptional()
  @IsNumber()
  sort?: number;
}
