import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserAddressService } from './user-address.service';
import { CreateUserAddressDto, UpdateUserAddressDto } from './dto/user.dto';

@ApiTags('收货地址')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user/address')
export class UserAddressController {
  constructor(private readonly userAddressService: UserAddressService) {}

  @Get('list')
  @ApiOperation({ summary: '地址列表' })
  async getList(
    @Query('uid') uid?: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const result = await this.userAddressService.getList({ uid, page, limit });
    return { status: 200, message: '获取成功', data: result };
  }

  @Get('user/:uid')
  @ApiOperation({ summary: '用户的所有地址' })
  async getByUid(@Param('uid', ParseIntPipe) uid: number) {
    const result = await this.userAddressService.getByUid(uid);
    return { status: 200, message: '获取成功', data: result };
  }

  @Get(':id')
  @ApiOperation({ summary: '地址详情' })
  async getDetail(@Param('id', ParseIntPipe) id: number) {
    const result = await this.userAddressService.getDetail(id);
    return { status: 200, message: '获取成功', data: result };
  }

  @Post()
  @ApiOperation({ summary: '创建地址' })
  async create(@Body() dto: CreateUserAddressDto) {
    const result = await this.userAddressService.create(dto);
    return { status: 200, message: '创建成功', data: result };
  }

  @Put(':id')
  @ApiOperation({ summary: '更新地址' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserAddressDto,
  ) {
    const result = await this.userAddressService.update(id, dto);
    return { status: 200, message: '更新成功', data: result };
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除地址' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.userAddressService.delete(id);
    return { status: 200, message: '删除成功' };
  }
}
