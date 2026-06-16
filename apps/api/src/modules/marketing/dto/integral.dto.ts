import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateIntegralDto {
  @ApiProperty({ description: '商品名称' })
  @IsString()
  @IsNotEmpty({ message: '请输入商品名称' })
  title!: string;

  @ApiPropertyOptional({ description: '商品图片' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ description: '商品ID' })
  @IsNumber()
  product_id!: number;

  @ApiProperty({ description: '积分价格' })
  @IsNumber()
  price!: number;

  @ApiProperty({ description: '总库存' })
  @IsNumber()
  total!: number;

  @ApiPropertyOptional({ description: '限购数量' })
  @IsOptional()
  @IsNumber()
  quota?: number;

  @ApiPropertyOptional({ description: '排序' })
  @IsOptional()
  @IsNumber()
  sort?: number;

  @ApiPropertyOptional({ description: '状态' })
  @IsOptional()
  @IsNumber()
  status?: number;
}

export class UpdateIntegralDto {
  @ApiPropertyOptional({ description: '商品名称' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: '商品图片' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ description: '商品ID' })
  @IsOptional()
  @IsNumber()
  product_id?: number;

  @ApiPropertyOptional({ description: '积分价格' })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({ description: '总库存' })
  @IsOptional()
  @IsNumber()
  total?: number;

  @ApiPropertyOptional({ description: '限购数量' })
  @IsOptional()
  @IsNumber()
  quota?: number;

  @ApiPropertyOptional({ description: '状态' })
  @IsOptional()
  @IsNumber()
  status?: number;

  @ApiPropertyOptional({ description: '排序' })
  @IsOptional()
  @IsNumber()
  sort?: number;
}
