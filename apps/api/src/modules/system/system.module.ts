import { Module } from '@nestjs/common';
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

@Module({
  controllers: [
    RoleController,
    MenuController,
    ConfigController,
    LogController,
    StoreController,
    StaffController,
  ],
  providers: [
    RoleService,
    MenuService,
    ConfigService,
    LogService,
    StoreService,
    StaffService,
  ],
  exports: [RoleService, MenuService, ConfigService, LogService, StoreService, StaffService],
})
export class SystemModule {}
