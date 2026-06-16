import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from './user.service';
import { QueryUserDto, UpdateUserDto } from './dto/user.dto';

@ApiTags('用户管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('list')
  @ApiOperation({ summary: '用户列表' })
  async getList(@Query() query: QueryUserDto) {
    const result = await this.userService.getList(query);
    return {
      status: 200,
      message: '获取成功',
      data: result,
    };
  }

  @Get(':uid')
  @ApiOperation({ summary: '用户详情' })
  async getDetail(@Param('uid', ParseIntPipe) uid: number) {
    const result = await this.userService.getDetail(uid);
    return {
      status: 200,
      message: '获取成功',
      data: result,
    };
  }

  @Put(':uid')
  @ApiOperation({ summary: '更新用户' })
  async update(
    @Param('uid', ParseIntPipe) uid: number,
    @Body() dto: UpdateUserDto,
  ) {
    const result = await this.userService.update(uid, dto);
    return {
      status: 200,
      message: '更新成功',
      data: result,
    };
  }

  @Delete(':uid')
  @ApiOperation({ summary: '删除用户' })
  async delete(@Param('uid', ParseIntPipe) uid: number) {
    await this.userService.delete(uid);
    return {
      status: 200,
      message: '删除成功',
    };
  }

  @Put(':uid/level')
  @ApiOperation({ summary: '设置用户等级' })
  async setLevel(
    @Param('uid', ParseIntPipe) uid: number,
    @Body('level', ParseIntPipe) level: number,
  ) {
    const result = await this.userService.setLevel(uid, level);
    return {
      status: 200,
      message: '设置成功',
      data: result,
    };
  }

  @Put(':uid/group')
  @ApiOperation({ summary: '设置用户分组' })
  async setGroup(
    @Param('uid', ParseIntPipe) uid: number,
    @Body('group_id', ParseIntPipe) group_id: number,
  ) {
    const result = await this.userService.setGroup(uid, group_id);
    return {
      status: 200,
      message: '设置成功',
      data: result,
    };
  }
}
