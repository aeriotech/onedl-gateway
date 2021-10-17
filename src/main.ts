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
import { getFromContainer, MetadataStorage } from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { TasksService } from './tasks/tasks.service';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      skipUndefinedProperties: true,
      enableDebugMessages: true,
      disableErrorMessages: false,
    }),
  );

  app.use(json({ limit: '50mb' }));

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
    swaggerOptions: {
      tagsSorder: 'alpha',
      operationsSorter: (a, b) => {
        const methodOrder = ['get', 'post', 'put', 'delete'];
        const methodA = methodOrder.indexOf(a._root.entries[1][1]);
        const methodB = methodOrder.indexOf(b._root.entries[1][1]);
        return methodA - methodB;
      },
    },
  };

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document, customOptions);

  const metadata = (getFromContainer(MetadataStorage) as any)
    .validationMetadatas;
  document.components.schemas = Object.assign(
    {},
    document.components.schemas || {},
    validationMetadatasToSchemas(metadata),
  );

  const configService = app.get(ConfigService);
  config.update({
    accessKeyId: configService.get('S3_ACCESS_KEY'),
    secretAccessKey: configService.get('S3_SECRET_KEY'),
    region: configService.get('S3_REGION'),
  });

  await app.listen(4000);

  const tasksService = app.get(TasksService);
  try {
    await tasksService.resendConfirmationEmails();
  } catch (e) {
    console.log(e);
  }
}
bootstrap();
