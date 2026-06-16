import { IsString, IsNotEmpty, MinLength, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AdminLoginDto {
  @ApiProperty({ description: '管理员账号', example: 'admin' })
  @IsString()
  @IsNotEmpty({ message: '请输入账号' })
  account!: string;

  @ApiProperty({ description: '密码', example: 'password' })
  @IsString()
  @IsNotEmpty({ message: '请输入密码' })
  @MinLength(6, { message: '密码至少6位' })
  password!: string;

  @ApiPropertyOptional({ description: '验证码' })
  @IsOptional()
  @IsString()
  captcha?: string;

  @ApiPropertyOptional({ description: '验证码key' })
  @IsOptional()
  @IsString()
  key?: string;
}

export class CreateAdminDto {
  @ApiProperty({ description: '管理员账号' })
  @IsString()
  @IsNotEmpty({ message: '请输入账号' })
  @MaxLength(64)
  account!: string;

  @ApiProperty({ description: '真实姓名' })
  @IsString()
  @IsNotEmpty({ message: '请输入真实姓名' })
  @MaxLength(64)
  real_name!: string;

  @ApiProperty({ description: '密码' })
  @IsString()
  @IsNotEmpty({ message: '请输入密码' })
  @MinLength(6, { message: '密码至少6位' })
  pwd!: string;

  @ApiPropertyOptional({ description: '手机号' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: '角色ID' })
  @IsOptional()
  role_id?: number;

  @ApiPropertyOptional({ description: '头像' })
  @IsOptional()
  @IsString()
  head_pic?: string;
}

export class UpdateAdminDto {
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
  head_pic?: string;

  @ApiPropertyOptional({ description: '状态 1=正常 0=禁用' })
  @IsOptional()
  status?: number;

  @ApiPropertyOptional({ description: '角色ID' })
  @IsOptional()
  role_id?: number;
}

export class ChangePasswordDto {
  @ApiProperty({ description: '原密码' })
  @IsString()
  @IsNotEmpty({ message: '请输入原密码' })
  old_password!: string;

  @ApiProperty({ description: '新密码' })
  @IsString()
  @IsNotEmpty({ message: '请输入新密码' })
  @MinLength(6, { message: '密码至少6位' })
  new_password!: string;
}
