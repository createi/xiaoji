import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AgentLevelService } from './agent-level.service';
import { AgentApplyService } from './agent-apply.service';
import { AgentController } from './agent.controller';

@Module({
  imports: [PrismaModule],
  providers: [AgentLevelService, AgentApplyService],
  controllers: [AgentController],
})
export class AgentModule {}
