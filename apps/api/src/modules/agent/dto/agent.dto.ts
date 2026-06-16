import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAgentLevelDto {
  @ApiProperty({ description: '等级名称' })
  @IsString()
  @IsNotEmpty({ message: '请输入等级名称' })
  name!: string;

  @ApiPropertyOptional({ description: '等级图片' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ description: '一级佣金比例' })
  @IsNumber()
  one_brokerage!: number;

  @ApiProperty({ description: '二级佣金比例' })
  @IsNumber()
  two_brokerage!: number;

  @ApiPropertyOptional({ description: '排序' })
  @IsOptional()
  @IsNumber()
  sort?: number;

  @ApiPropertyOptional({ description: '状态' })
  @IsOptional()
  @IsNumber()
  status?: number;
}

export class UpdateAgentLevelDto {
  @ApiPropertyOptional({ description: '等级名称' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: '等级图片' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ description: '一级佣金比例' })
  @IsOptional()
  @IsNumber()
  one_brokerage?: number;

  @ApiPropertyOptional({ description: '二级佣金比例' })
  @IsOptional()
  @IsNumber()
  two_brokerage?: number;

  @ApiPropertyOptional({ description: '排序' })
  @IsOptional()
  @IsNumber()
  sort?: number;

  @ApiPropertyOptional({ description: '状态' })
  @IsOptional()
  @IsNumber()
  status?: number;
}

export class UpdateApplyDto {
  @ApiProperty({ description: '审核状态: 1=通过 2=拒绝' })
  @IsNumber()
  status!: number;

  @ApiPropertyOptional({ description: '拒绝原因' })
  @IsOptional()
  @IsString()
  reason?: string;
}
