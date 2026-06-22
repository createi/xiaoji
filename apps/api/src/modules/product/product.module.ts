import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { ReplyController } from './reply.controller';
import { ReplyService } from './reply.service';
import { ProductLabelController } from './product-label.controller';
import { ProductLabelService } from './product-label.service';
import { AttributeController } from './attribute.controller';
import { AttributeService } from './attribute.service';

@Module({
  controllers: [
    ProductController,
    CategoryController,
    ReplyController,
    ProductLabelController,
    AttributeController,
  ],
  providers: [
    ProductService,
    CategoryService,
    ReplyService,
    ProductLabelService,
    AttributeService,
  ],
})
export class ProductModule {}
