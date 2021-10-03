import { Module } from '@nestjs/common';
import { EmailConfirmationModule } from 'src/email-confirmation/email-confirmation.module';
import { MailModule } from 'src/mail/mail.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { TasksService } from './tasks.service';

@Module({
  imports: [MailModule, EmailConfirmationModule],
  providers: [TasksService, PrismaService],
  exports: [TasksService],
})
export class TasksModule {}
