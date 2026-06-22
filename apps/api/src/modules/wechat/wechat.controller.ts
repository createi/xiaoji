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
import { WechatService } from './wechat.service';

@ApiTags('微信管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wechat')
export class WechatController {
  constructor(private readonly wechatService: WechatService) {}

  // ==================== WechatUser ====================

  @Get('user/list')
  @ApiOperation({ summary: '微信用户列表' })
  async getUserList(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('keywords') keywords?: string,
  ) {
    const result = await this.wechatService.getUserList({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 15,
      keywords,
    });
    return {
      status: 200,
      message: '获取成功',
      data: result,
    };
  }

  // ==================== WechatQrcode ====================

  @Get('qrcode/list')
  @ApiOperation({ summary: '二维码列表' })
  async getQrcodeList(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.wechatService.getQrcodeList({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 15,
    });
    return {
      status: 200,
      message: '获取成功',
      data: result,
    };
  }

  @Post('qrcode')
  @ApiOperation({ summary: '创建二维码' })
  async createQrcode(
    @Body() body: { name: string; type?: number; group_id?: number; category_id?: number; code_url?: string; image_url?: string },
  ) {
    const result = await this.wechatService.createQrcode(body);
    return {
      status: 200,
      message: '创建成功',
      data: result,
    };
  }

  @Delete('qrcode/:id')
  @ApiOperation({ summary: '删除二维码' })
  async deleteQrcode(@Param('id', ParseIntPipe) id: number) {
    await this.wechatService.deleteQrcode(id);
    return {
      status: 200,
      message: '删除成功',
    };
  }

  // ==================== WechatReply ====================

  @Get('reply/list')
  @ApiOperation({ summary: '回复规则列表' })
  async getReplyList(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.wechatService.getReplyList({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 15,
    });
    return {
      status: 200,
      message: '获取成功',
      data: result,
    };
  }

  @Post('reply')
  @ApiOperation({ summary: '创建回复规则' })
  async createReply(
    @Body() body: { uid?: number; type?: string; content: string; status?: number; sort?: number },
  ) {
    const result = await this.wechatService.createReply(body);
    return {
      status: 200,
      message: '创建成功',
      data: result,
    };
  }

  @Put('reply/:id')
  @ApiOperation({ summary: '更新回复规则' })
  async updateReply(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { type?: string; content?: string; status?: number; sort?: number },
  ) {
    const result = await this.wechatService.updateReply(id, body);
    return {
      status: 200,
      message: '更新成功',
      data: result,
    };
  }

  @Delete('reply/:id')
  @ApiOperation({ summary: '删除回复规则' })
  async deleteReply(@Param('id', ParseIntPipe) id: number) {
    await this.wechatService.deleteReply(id);
    return {
      status: 200,
      message: '删除成功',
    };
  }

  // ==================== WechatMedia ====================

  @Get('media/list')
  @ApiOperation({ summary: '素材列表' })
  async getMediaList(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('type') type?: string,
  ) {
    const result = await this.wechatService.getMediaList({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 15,
      type,
    });
    return {
      status: 200,
      message: '获取成功',
      data: result,
    };
  }

  // ==================== WechatMessage ====================

  @Get('message/list')
  @ApiOperation({ summary: '消息列表' })
  async getMessageList(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.wechatService.getMessageList({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 15,
    });
    return {
      status: 200,
      message: '获取成功',
      data: result,
    };
  }

  // ==================== WechatKey ====================

  @Get('key/list')
  @ApiOperation({ summary: '关键词列表' })
  async getKeyList(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.wechatService.getKeyList({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 15,
    });
    return {
      status: 200,
      message: '获取成功',
      data: result,
    };
  }

  @Post('key')
  @ApiOperation({ summary: '创建关键词' })
  async createKey(
    @Body() body: { name: string; account?: string; path?: string; qr_code?: string },
  ) {
    const result = await this.wechatService.createKey(body);
    return {
      status: 200,
      message: '创建成功',
      data: result,
    };
  }

  @Put('key/:id')
  @ApiOperation({ summary: '更新关键词' })
  async updateKey(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { name?: string; account?: string; path?: string; qr_code?: string },
  ) {
    const result = await this.wechatService.updateKey(id, body);
    return {
      status: 200,
      message: '更新成功',
      data: result,
    };
  }
}
