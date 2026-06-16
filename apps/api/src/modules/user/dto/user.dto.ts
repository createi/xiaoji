import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsEnum, Min, Max } from 'class-validator';

export class QueryUserDto {
  @ApiPropertyOptional({ description: '页码' })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({ description: '每页数量' })
  @IsOptional()
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional({ description: '搜索类型: all/uid/phone/nickname' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ description: '搜索关键词' })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({ description: '会员等级' })
  @IsOptional()
  @IsNumber()
  level?: number;

  @ApiPropertyOptional({ description: '用户分组' })
  @IsOptional()
  @IsNumber()
  group_id?: number;

  @ApiPropertyOptional({ description: '分销等级' })
  @IsOptional()
  @IsNumber()
  agent_level?: number;

  @ApiPropertyOptional({ description: '是否推广员 0=否 1=是' })
  @IsOptional()
  @IsNumber()
  is_promoter?: number;

  @ApiPropertyOptional({ description: '开始时间' })
  @IsOptional()
  @IsString()
  start_time?: string;

  @ApiPropertyOptional({ description: '结束时间' })
  @IsOptional()
  @IsString()
  end_time?: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional({ description: '昵称' })
  @IsOptional()
  @IsString()
  nickname?: string;

  @ApiPropertyOptional({ description: '真实姓名' })
  @IsOptional()
  @IsString()
  real_name?: string;

  @ApiPropertyOptional({ description: '手机号' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: '头像' })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({ description: '性别 0=未知 1=男 2=女' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(2)
  sex?: number;

  @ApiPropertyOptional({ description: '生日' })
  @IsOptional()
  @IsNumber()
  birthday?: number;

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  mark?: string;

  @ApiPropertyOptional({ description: '会员等级' })
  @IsOptional()
  @IsNumber()
  level?: number;

  @ApiPropertyOptional({ description: '用户分组' })
  @IsOptional()
  @IsNumber()
  group_id?: number;

  @ApiPropertyOptional({ description: '状态 1=正常 0=禁用' })
  @IsOptional()
  @IsNumber()
  status?: number;
}

// ==================== 用户等级 ====================

export class CreateUserLevelDto {
  @ApiProperty({ description: '等级名称' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: '等级图标' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ description: '等级值' })
  @IsNumber()
  grade: number;

  @ApiPropertyOptional({ description: '一级佣金比例(%)' })
  @IsOptional()
  @IsNumber()
  one_brokerage_percent?: number;

  @ApiPropertyOptional({ description: '二级佣金比例(%)' })
  @IsOptional()
  @IsNumber()
  two_brokerage_percent?: number;

  @ApiPropertyOptional({ description: '任务总数' })
  @IsOptional()
  @IsNumber()
  task_total_num?: number;

  @ApiPropertyOptional({ description: '状态 1=正常 0=禁用' })
  @IsOptional()
  @IsNumber()
  status?: number;
}

export class UpdateUserLevelDto extends CreateUserLevelDto {}

// ==================== 用户分组 ====================

export class CreateUserGroupDto {
  @ApiProperty({ description: '分组名称' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: '分组图标' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ description: '排序' })
  @IsOptional()
  @IsNumber()
  sort?: number;

  @ApiPropertyOptional({ description: '状态 1=正常 0=禁用' })
  @IsOptional()
  @IsNumber()
  status?: number;

  @ApiPropertyOptional({ description: '是否显示 1=显示 0=隐藏' })
  @IsOptional()
  @IsNumber()
  is_show?: number;
}

export class UpdateUserGroupDto extends CreateUserGroupDto {}

// ==================== 用户标签 ====================

export class CreateUserLabelDto {
  @ApiProperty({ description: '标签名称' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: '标签颜色' })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional({ description: '排序' })
  @IsOptional()
  @IsNumber()
  sort?: number;

  @ApiPropertyOptional({ description: '状态 1=正常 0=禁用' })
  @IsOptional()
  @IsNumber()
  status?: number;
}

export class UpdateUserLabelDto extends CreateUserLabelDto {}

// ==================== 收货地址 ====================

export class CreateUserAddressDto {
  @ApiProperty({ description: '用户 UID' })
  @IsNumber()
  uid: number;

  @ApiProperty({ description: '收货人姓名' })
  @IsString()
  real_name: string;

  @ApiProperty({ description: '手机号' })
  @IsString()
  phone: string;

  @ApiProperty({ description: '省' })
  @IsString()
  province: string;

  @ApiProperty({ description: '市' })
  @IsString()
  city: string;

  @ApiProperty({ description: '区' })
  @IsString()
  district: string;

  @ApiProperty({ description: '详细地址' })
  @IsString()
  detail: string;

  @ApiPropertyOptional({ description: '是否默认 1=是 0=否' })
  @IsOptional()
  @IsNumber()
  is_default?: number;

  @ApiPropertyOptional({ description: '纬度' })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ description: '经度' })
  @IsOptional()
  @IsNumber()
  longitude?: number;
}

export class UpdateUserAddressDto extends CreateUserAddressDto {}
