import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { SeckillService } from './seckill.service';
import { SeckillController } from './seckill.controller';
import { CombinationService } from './combination.service';
import { CombinationController } from './combination.controller';
import { BargainService } from './bargain.service';
import { BargainController } from './bargain.controller';
import { IntegralService } from './integral.service';
import { IntegralController } from './integral.controller';
import { SignService } from './sign.service';
import { SignController } from './sign.controller';

@Module({
  imports: [PrismaModule],
  providers: [
    CouponService,
    SeckillService,
    CombinationService,
    BargainService,
    IntegralService,
    SignService,
  ],
  controllers: [
    CouponController,
    SeckillController,
    CombinationController,
    BargainController,
    IntegralController,
    SignController,
  ],
})
export class MarketingModule {}
