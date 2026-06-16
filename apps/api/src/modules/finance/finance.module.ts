import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { BillService } from './bill.service';
import { BillController } from './bill.controller';
import { ExtractService } from './extract.service';
import { ExtractController } from './extract.controller';

@Module({
  imports: [PrismaModule],
  providers: [BillService, ExtractService],
  controllers: [BillController, ExtractController],
})
export class FinanceModule {}
