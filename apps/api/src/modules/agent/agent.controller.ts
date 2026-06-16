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
import { AgentLevelService } from './agent-level.service';
import { AgentApplyService } from './agent-apply.service';
import { CreateAgentLevelDto, UpdateAgentLevelDto, UpdateApplyDto } from './dto/agent.dto';

@ApiTags('分销管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('agent')
export class AgentController {
  constructor(
    private readonly levelService: AgentLevelService,
    private readonly applyService: AgentApplyService,
  ) {}

  // 分销等级
  @Get('level/list')
  @ApiOperation({ summary: '分销等级列表' })
  async getLevelList(@Query('page') page?: number, @Query('limit') limit?: number) {
    const result = await this.levelService.getList({ page, limit });
    return { status: 200, message: '获取成功', data: result };
  }

  @Get('level/all')
  @ApiOperation({ summary: '所有分销等级' })
  async getAllLevels() {
    const result = await this.levelService.getAll();
    return { status: 200, message: '获取成功', data: result };
  }

  @Get('level/:id')
  @ApiOperation({ summary: '分销等级详情' })
  async getLevelDetail(@Param('id', ParseIntPipe) id: number) {
    const result = await this.levelService.getDetail(id);
    return { status: 200, message: '获取成功', data: result };
  }

  @Post('level')
  @ApiOperation({ summary: '创建分销等级' })
  async createLevel(@Body() dto: CreateAgentLevelDto) {
    const result = await this.levelService.create(dto);
    return { status: 200, message: '创建成功', data: result };
  }

  @Put('level/:id')
  @ApiOperation({ summary: '更新分销等级' })
  async updateLevel(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAgentLevelDto) {
    const result = await this.levelService.update(id, dto);
    return { status: 200, message: '更新成功', data: result };
  }

  @Delete('level/:id')
  @ApiOperation({ summary: '删除分销等级' })
  async deleteLevel(@Param('id', ParseIntPipe) id: number) {
    await this.levelService.delete(id);
    return { status: 200, message: '删除成功' };
  }

  // 分销申请
  @Get('apply/list')
  @ApiOperation({ summary: '分销申请列表' })
  async getApplyList(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: number,
  ) {
    const result = await this.applyService.getList({ page, limit, status });
    return { status: 200, message: '获取成功', data: result };
  }

  @Get('apply/:id')
  @ApiOperation({ summary: '分销申请详情' })
  async getApplyDetail(@Param('id', ParseIntPipe) id: number) {
    const result = await this.applyService.getDetail(id);
    return { status: 200, message: '获取成功', data: result };
  }

  @Put('apply/:id/approve')
  @ApiOperation({ summary: '审核通过' })
  async approveApply(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateApplyDto) {
    const result = await this.applyService.approve(id, dto);
    return { status: 200, message: '审核成功', data: result };
  }

  @Put('apply/:id/reject')
  @ApiOperation({ summary: '审核拒绝' })
  async rejectApply(@Param('id', ParseIntPipe) id: number) {
    const result = await this.applyService.reject(id, { status: 2 });
    return { status: 200, message: '拒绝成功', data: result };
  }
}
