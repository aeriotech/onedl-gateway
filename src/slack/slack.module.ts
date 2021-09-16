import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SlackService } from './slack.service';

@Module({
  providers: [SlackService, PrismaService],
  exports: [SlackService],
})
export class SlackModule {}
