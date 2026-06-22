import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { RefundService } from './refund.service';
import { RefundController } from './refund.controller';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';

@Module({
  controllers: [OrderController, RefundController, InvoiceController],
  providers: [OrderService, RefundService, InvoiceService],
})
export class OrderModule {}
