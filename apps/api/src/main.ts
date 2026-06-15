import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const port = configService.get<number>('port', 7001);
  const swaggerEnabled = configService.get<boolean>('swagger.enabled');
  const corsOrigin = configService.get<string>('CORS_ORIGIN') || '*';

  app.enableCors({
    origin: corsOrigin.split(','),
    credentials: true,
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  if (swaggerEnabled) {
    const config = new DocumentBuilder()
      .setTitle('xiaoji API')
      .setDescription('xiaoji 电商平台 API 文档')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  await app.listen(port);
  console.log(`🚀 xiaoji API running on: http://localhost:${port}`);
  if (swaggerEnabled) {
    console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
  }
}

bootstrap();
