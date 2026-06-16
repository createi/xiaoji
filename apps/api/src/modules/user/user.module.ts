import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserLevelController } from './user-level.controller';
import { UserLevelService } from './user-level.service';
import { UserGroupController } from './user-group.controller';
import { UserGroupService } from './user-group.service';
import { UserLabelController } from './user-label.controller';
import { UserLabelService } from './user-label.service';
import { UserAddressController } from './user-address.controller';
import { UserAddressService } from './user-address.service';

@Module({
  controllers: [
    UserController,
    UserLevelController,
    UserGroupController,
    UserLabelController,
    UserAddressController,
  ],
  providers: [
    UserService,
    UserLevelService,
    UserGroupService,
    UserLabelService,
    UserAddressService,
  ],
})
export class UserModule {}
