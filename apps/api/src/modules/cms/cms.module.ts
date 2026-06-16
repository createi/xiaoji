import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ArticleService } from './article.service';
import { ArticleCategoryService } from './article-category.service';
import { CmsController } from './cms.controller';

@Module({
  imports: [PrismaModule],
  providers: [ArticleService, ArticleCategoryService],
  controllers: [CmsController],
})
export class CmsModule {}
