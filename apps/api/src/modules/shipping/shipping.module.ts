import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { TemplateService } from './template.service';
import { ExpressService } from './express.service';
import { ShippingController } from './shipping.controller';

@Module({
  imports: [PrismaModule],
  providers: [TemplateService, ExpressService],
  controllers: [ShippingController],
})
export class ShippingModule {}
