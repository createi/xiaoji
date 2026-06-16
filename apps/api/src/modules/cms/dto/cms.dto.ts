import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateArticleDto {
  @ApiProperty({ description: '文章标题' })
  @IsString()
  @IsNotEmpty({ message: '请输入文章标题' })
  title!: string;

  @ApiPropertyOptional({ description: '文章作者' })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiPropertyOptional({ description: '封面图' })
  @IsOptional()
  @IsString()
  image_input?: string;

  @ApiProperty({ description: '文章内容' })
  @IsString()
  @IsNotEmpty({ message: '请输入文章内容' })
  content!: string;

  @ApiPropertyOptional({ description: '摘要' })
  @IsOptional()
  @IsString()
  digest?: string;

  @ApiPropertyOptional({ description: '分类ID' })
  @IsOptional()
  @IsNumber()
  cid?: number;

  @ApiPropertyOptional({ description: '排序' })
  @IsOptional()
  @IsNumber()
  sort?: number;

  @ApiPropertyOptional({ description: '是否热门' })
  @IsOptional()
  @IsNumber()
  is_hot?: number;

  @ApiPropertyOptional({ description: '是否精选' })
  @IsOptional()
  @IsNumber()
  is_best?: number;

  @ApiPropertyOptional({ description: '是否最新' })
  @IsOptional()
  @IsNumber()
  is_new?: number;
}

export class UpdateArticleDto {
  @ApiPropertyOptional({ description: '文章标题' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: '文章作者' })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiPropertyOptional({ description: '封面图' })
  @IsOptional()
  @IsString()
  image_input?: string;

  @ApiPropertyOptional({ description: '文章内容' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ description: '摘要' })
  @IsOptional()
  @IsString()
  digest?: string;

  @ApiPropertyOptional({ description: '分类ID' })
  @IsOptional()
  @IsNumber()
  cid?: number;

  @ApiPropertyOptional({ description: '排序' })
  @IsOptional()
  @IsNumber()
  sort?: number;

  @ApiPropertyOptional({ description: '是否热门' })
  @IsOptional()
  @IsNumber()
  is_hot?: number;

  @ApiPropertyOptional({ description: '是否精选' })
  @IsOptional()
  @IsNumber()
  is_best?: number;

  @ApiPropertyOptional({ description: '是否最新' })
  @IsOptional()
  @IsNumber()
  is_new?: number;

  @ApiPropertyOptional({ description: '状态' })
  @IsOptional()
  @IsNumber()
  status?: number;
}

export class CreateArticleCategoryDto {
  @ApiProperty({ description: '分类名称' })
  @IsString()
  @IsNotEmpty({ message: '请输入分类名称' })
  name!: string;

  @ApiPropertyOptional({ description: '父级ID' })
  @IsOptional()
  @IsNumber()
  pid?: number;

  @ApiPropertyOptional({ description: '排序' })
  @IsOptional()
  @IsNumber()
  sort?: number;

  @ApiPropertyOptional({ description: '状态' })
  @IsOptional()
  @IsNumber()
  status?: number;
}

export class UpdateArticleCategoryDto {
  @ApiPropertyOptional({ description: '分类名称' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: '父级ID' })
  @IsOptional()
  @IsNumber()
  pid?: number;

  @ApiPropertyOptional({ description: '排序' })
  @IsOptional()
  @IsNumber()
  sort?: number;

  @ApiPropertyOptional({ description: '状态' })
  @IsOptional()
  @IsNumber()
  status?: number;
}
