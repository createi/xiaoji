import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Req,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AdminLoginDto, CreateAdminDto, UpdateAdminDto, ChangePasswordDto } from './dto/auth.dto';

@ApiTags('认证管理')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin/login')
  @ApiOperation({ summary: '管理员登录' })
  @HttpCode(HttpStatus.OK)
  async adminLogin(@Body() dto: AdminLoginDto, @Req() req: Request) {
    const ip = req.ip || req.socket.remoteAddress || '';
    const result = await this.authService.adminLogin(dto.account, dto.password, ip);
    return {
      status: 200,
      message: '登录成功',
      data: result,
    };
  }

  @Get('admin/info')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取管理员信息' })
  async getAdminInfo(@Req() req: any) {
    const info = await this.authService.getAdminInfo(req.user.id);
    return {
      status: 200,
      message: '获取成功',
      data: info,
    };
  }

  @Get('admin/list')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '管理员列表' })
  async getAdminList(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('account') account?: string,
    @Query('real_name') real_name?: string,
  ) {
    const result = await this.authService.getAdminList({
      page: page || 1,
      limit: limit || 10,
      account,
      real_name,
    });
    return {
      status: 200,
      message: '获取成功',
      data: result,
    };
  }

  @Post('admin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建管理员' })
  async createAdmin(@Body() dto: CreateAdminDto) {
    const result = await this.authService.createAdmin(dto);
    return {
      status: 200,
      message: '创建成功',
      data: result,
    };
  }

  @Put('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新管理员' })
  async updateAdmin(@Req() req: any, @Body() dto: UpdateAdminDto) {
    const result = await this.authService.updateAdmin(req.params.id, dto);
    return {
      status: 200,
      message: '更新成功',
      data: result,
    };
  }

  @Put('admin/password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '修改密码' })
  async changePassword(@Req() req: any, @Body() dto: ChangePasswordDto) {
    await this.authService.changePassword(req.user.id, dto.old_password, dto.new_password);
    return {
      status: 200,
      message: '密码修改成功',
    };
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除管理员' })
  async deleteAdmin(@Req() req: any) {
    await this.authService.deleteAdmin(req.params.id);
    return {
      status: 200,
      message: '删除成功',
    };
  }

  @Post('admin/logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '管理员退出' })
  @HttpCode(HttpStatus.OK)
  async adminLogout() {
    return {
      status: 200,
      message: '退出成功',
    };
  }
}
