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
import { ArticleService } from './article.service';
import { ArticleCategoryService } from './article-category.service';
import {
  CreateArticleDto,
  UpdateArticleDto,
  CreateArticleCategoryDto,
  UpdateArticleCategoryDto,
} from './dto/cms.dto';

@ApiTags('CMS管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cms')
export class CmsController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly categoryService: ArticleCategoryService,
  ) {}

  // 文章
  @Get('article/list')
  @ApiOperation({ summary: '文章列表' })
  async getArticleList(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('title') title?: string,
    @Query('cid') cid?: string,
  ) {
    const result = await this.articleService.getList({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      title,
      cid: cid ? Number(cid) : undefined,
    });
    return { status: 200, message: '获取成功', data: result };
  }

  @Get('article/:id')
  @ApiOperation({ summary: '文章详情' })
  async getArticleDetail(@Param('id', ParseIntPipe) id: number) {
    const result = await this.articleService.getDetail(id);
    return { status: 200, message: '获取成功', data: result };
  }

  @Post('article')
  @ApiOperation({ summary: '创建文章' })
  async createArticle(@Body() dto: CreateArticleDto) {
    const result = await this.articleService.create(dto);
    return { status: 200, message: '创建成功', data: result };
  }

  @Put('article/:id')
  @ApiOperation({ summary: '更新文章' })
  async updateArticle(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateArticleDto) {
    const result = await this.articleService.update(id, dto);
    return { status: 200, message: '更新成功', data: result };
  }

  @Delete('article/:id')
  @ApiOperation({ summary: '删除文章' })
  async deleteArticle(@Param('id', ParseIntPipe) id: number) {
    await this.articleService.delete(id);
    return { status: 200, message: '删除成功' };
  }

  // 文章分类
  @Get('category/list')
  @ApiOperation({ summary: '文章分类列表' })
  async getCategoryList() {
    const result = await this.categoryService.getList();
    return { status: 200, message: '获取成功', data: result };
  }

  @Get('category/:id')
  @ApiOperation({ summary: '文章分类详情' })
  async getCategoryDetail(@Param('id', ParseIntPipe) id: number) {
    const result = await this.categoryService.getDetail(id);
    return { status: 200, message: '获取成功', data: result };
  }

  @Post('category')
  @ApiOperation({ summary: '创建文章分类' })
  async createCategory(@Body() dto: CreateArticleCategoryDto) {
    const result = await this.categoryService.create(dto);
    return { status: 200, message: '创建成功', data: result };
  }

  @Put('category/:id')
  @ApiOperation({ summary: '更新文章分类' })
  async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateArticleCategoryDto,
  ) {
    const result = await this.categoryService.update(id, dto);
    return { status: 200, message: '更新成功', data: result };
  }

  @Delete('category/:id')
  @ApiOperation({ summary: '删除文章分类' })
  async deleteCategory(@Param('id', ParseIntPipe) id: number) {
    await this.categoryService.delete(id);
    return { status: 200, message: '删除成功' };
  }
}
