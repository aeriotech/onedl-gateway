import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { validate } from 'class-validator'
import { config } from 'aws-sdk'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      skipMissingProperties: true,
      forbidNonWhitelisted: true,
    }),
  )

  const configService = app.get(ConfigService)
  config.update({
    accessKeyId: configService.get('S3_ACCESS_KEY'),
    secretAccessKey: configService.get('S3_SECRET_KEY'),
    region: configService.get('S3_REGION'),
    s3BucketEndpoint: configService.get('S3_ENDPOINT'),
  })

  await app.listen(4000)
}
bootstrap()
