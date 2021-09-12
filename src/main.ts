import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { config } from 'aws-sdk';
import { AppModule } from './app.module';
import * as morgan from 'morgan';

import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      skipUndefinedProperties: true,
    }),
  );

  app.use(morgan('tiny'));
  app.enableCors();

  app.enableShutdownHooks();

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Fundl API')
    .setDescription('The Fundl API documentation')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', bearerFormat: 'JWT' }, 'User')
    .addBearerAuth({ type: 'http', bearerFormat: 'JWT' }, 'Admin')

    .build();
  const customOptions: SwaggerCustomOptions = {
    customSiteTitle: 'Fundl API Documentation',
  };
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document, customOptions);

  const configService = app.get(ConfigService);
  config.update({
    accessKeyId: configService.get('S3_ACCESS_KEY'),
    secretAccessKey: configService.get('S3_SECRET_KEY'),
    region: configService.get('S3_REGION'),
  });

  await app.listen(4000);
}
bootstrap();
