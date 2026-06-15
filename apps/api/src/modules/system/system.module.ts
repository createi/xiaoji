import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';

@Module({
  controllers: [RoleController, MenuController],
  providers: [RoleService, MenuService],
  exports: [RoleService, MenuService],
})
export class SystemModule {}
