import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { ReplyController } from './reply.controller';
import { ReplyService } from './reply.service';
import { ProductLabelController } from './product-label.controller';
import { ProductLabelService } from './product-label.service';

@Module({
  controllers: [
    ProductController,
    CategoryController,
    ReplyController,
    ProductLabelController,
  ],
  providers: [
    ProductService,
    CategoryService,
    ReplyService,
    ProductLabelService,
  ],
})
export class ProductModule {}
