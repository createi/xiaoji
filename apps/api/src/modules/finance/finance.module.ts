import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { BillService } from './bill.service';
import { BillController } from './bill.controller';
import { ExtractService } from './extract.service';
import { ExtractController } from './extract.controller';
import { CommissionService } from './commission.service';
import { CommissionController } from './commission.controller';
import { CapitalFlowService } from './capital-flow.service';
import { CapitalFlowController } from './capital-flow.controller';

@Module({
  imports: [PrismaModule],
  providers: [BillService, ExtractService, CommissionService, CapitalFlowService],
  controllers: [BillController, ExtractController, CommissionController, CapitalFlowController],
})
export class FinanceModule {}
