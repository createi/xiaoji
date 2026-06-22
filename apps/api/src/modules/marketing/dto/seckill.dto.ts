import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSeckillDto {
  @ApiProperty({ description: '活动标题' })
  @IsString()
  @IsNotEmpty({ message: '请输入活动标题' })
  title!: string;

  @ApiPropertyOptional({ description: '活动名称' })
  @IsOptional()
  @IsString()
  activity_name?: string;

  @ApiProperty({ description: '商品ID' })
  @IsNumber()
  product_id!: number;

  @ApiProperty({ description: '秒杀价格' })
  @IsNumber()
  price!: number;

  @ApiProperty({ description: '秒杀库存' })
  @IsNumber()
  stock!: number;

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
}

export class UpdateSeckillDto {
  @ApiPropertyOptional({ description: '活动标题' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: '活动名称' })
  @IsOptional()
  @IsString()
  activity_name?: string;

  @ApiPropertyOptional({ description: '商品ID' })
  @IsOptional()
  @IsNumber()
  product_id?: number;

  @ApiPropertyOptional({ description: '秒杀价格' })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({ description: '秒杀库存' })
  @IsOptional()
  @IsNumber()
  stock?: number;

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

  @ApiPropertyOptional({ description: '排序' })
  @IsOptional()
  @IsNumber()
  sort?: number;
}
