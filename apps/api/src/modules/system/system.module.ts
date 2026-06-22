import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { ConfigController } from './config.controller';
import { ConfigService } from './config.service';
import { LogController } from './log.controller';
import { LogService } from './log.service';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';
import { TimerController } from './timer.controller';
import { TimerService } from './timer.service';
import { AgreementController } from './agreement.controller';
import { AgreementService } from './agreement.service';

@Module({
  imports: [PrismaModule],
  controllers: [
    RoleController,
    MenuController,
    ConfigController,
    LogController,
    StoreController,
    StaffController,
    StorageController,
    TimerController,
    AgreementController,
  ],
  providers: [
    RoleService,
    MenuService,
    ConfigService,
    LogService,
    StoreService,
    StaffService,
    StorageService,
    TimerService,
    AgreementService,
  ],
  exports: [RoleService, MenuService, ConfigService, LogService, StoreService, StaffService, StorageService, TimerService, AgreementService],
})
export class SystemModule {}
