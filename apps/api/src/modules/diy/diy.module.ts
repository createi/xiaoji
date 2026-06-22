import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { DiyController } from './diy.controller';
import { DiyService } from './diy.service';

@Module({
  imports: [PrismaModule],
  controllers: [DiyController],
  providers: [DiyService],
  exports: [DiyService],
})
export class DiyModule {}
