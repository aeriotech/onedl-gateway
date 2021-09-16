import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { EmailConfirmationModule } from 'src/email-confirmation/email-confirmation.module';
import { SlackModule } from 'src/slack/slack.module';

@Module({
  imports: [EmailConfirmationModule, SlackModule],
  providers: [UserService, PrismaService],
  controllers: [UserController],
  exports: [UserService, EmailConfirmationModule],
})
export class UserModule {}
