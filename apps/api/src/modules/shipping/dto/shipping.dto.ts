import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTemplateDto {
  @ApiProperty({ description: '模板名称' })
  @IsString()
  @IsNotEmpty({ message: '请输入模板名称' })
  name!: string;

  @ApiProperty({ description: '类型: 1=按件 2=按重量 3=按体积' })
  @IsNumber()
  type!: number;

  @ApiPropertyOptional({ description: '指定包邮' })
  @IsOptional()
  @IsNumber()
  appoint?: number;

  @ApiPropertyOptional({ description: '排序' })
  @IsOptional()
  @IsNumber()
  sort?: number;
}

export class UpdateTemplateDto {
  @ApiPropertyOptional({ description: '模板名称' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: '类型: 1=按件 2=按重量 3=按体积' })
  @IsOptional()
  @IsNumber()
  type?: number;

  @ApiPropertyOptional({ description: '指定包邮' })
  @IsOptional()
  @IsNumber()
  appoint?: number;

  @ApiPropertyOptional({ description: '排序' })
  @IsOptional()
  @IsNumber()
  sort?: number;
}

export class CreateExpressDto {
  @ApiProperty({ description: '快递公司名称' })
  @IsString()
  @IsNotEmpty({ message: '请输入快递公司名称' })
  name!: string;

  @ApiProperty({ description: '快递公司代码' })
  @IsString()
  @IsNotEmpty({ message: '请输入快递公司代码' })
  code!: string;

  @ApiPropertyOptional({ description: '快递公司网址' })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiPropertyOptional({ description: '排序' })
  @IsOptional()
  @IsNumber()
  sort?: number;

  @ApiPropertyOptional({ description: '是否显示' })
  @IsOptional()
  @IsNumber()
  is_show?: number;
}

export class UpdateExpressDto {
  @ApiPropertyOptional({ description: '快递公司名称' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: '快递公司代码' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ description: '快递公司网址' })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiPropertyOptional({ description: '排序' })
  @IsOptional()
  @IsNumber()
  sort?: number;

  @ApiPropertyOptional({ description: '是否显示' })
  @IsOptional()
  @IsNumber()
  is_show?: number;
}
