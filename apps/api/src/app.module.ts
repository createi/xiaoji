import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import configuration from './config/configuration';

// Prisma
import { PrismaModule } from './prisma/prisma.module';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { SystemModule } from './modules/system/system.module';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { OrderModule } from './modules/order/order.module';
import { UploadModule } from './modules/upload/upload.module';
import { MarketingModule } from './modules/marketing/marketing.module';
import { AgentModule } from './modules/agent/agent.module';
import { FinanceModule } from './modules/finance/finance.module';
import { CmsModule } from './modules/cms/cms.module';
import { StatisticModule } from './modules/statistic/statistic.module';
import { ShippingModule } from './modules/shipping/shipping.module';
import { WebSocketModule } from './modules/websocket/websocket.module';
import { QueueModule } from './modules/queue/queue.module';
import { DiyModule } from './modules/diy/diy.module';
import { WechatModule } from './modules/wechat/wechat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: [
        `.env.${process.env.NODE_ENV || 'development'}`,
        '../../.env.development',
      ],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: config.get<number>('rateLimit.ttl') || 60,
            limit: config.get<number>('rateLimit.limit') || 100,
          },
        ],
      }),
    }),
    PrismaModule,
    AuthModule,
    SystemModule,
    UserModule,
    ProductModule,
    OrderModule,
    UploadModule,
    MarketingModule,
    AgentModule,
    FinanceModule,
    CmsModule,
    StatisticModule,
    ShippingModule,
    WebSocketModule,
    QueueModule,
    DiyModule,
    WechatModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
