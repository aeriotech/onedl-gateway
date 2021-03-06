import { PrismaService } from 'src/prisma/prisma.service';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { EmailConfirmationModule } from 'src/email-confirmation/email-confirmation.module';
import { SlackModule } from 'src/slack/slack.module';
import { DiscordModule } from 'src/discord/discord.module';
import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
@Module({
  imports: [EmailConfirmationModule, SlackModule, DiscordModule],
  providers: [UserService, PrismaService, UserResolver],
  controllers: [UserController],
  exports: [UserService, EmailConfirmationModule, DiscordModule],
})
export class UserModule {}
