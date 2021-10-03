import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as dayjs from 'dayjs';
import { EmailConfirmationService } from 'src/email-confirmation/email-confirmation.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  // @Cron('* 0 * * * *')
  // deleteUnconfirmedUsers() {
  //   this.logger.log('Deleting unconfirmed users');
  //   const deleteTime = dayjs().subtract(7, 'day').toISOString();
  //   this.prisma.user.deleteMany({
  //     where: {
  //       emailConfirmed: false,
  //       emailConfirmationSentAt: {
  //         lt: deleteTime,
  //       },
  //     },
  //   });
  //   this.logger.log('Unconfirmed users deleted');
  // }

  @Cron('0 */1 * * *')
  async resendConfirmationEmails() {
    this.logger.log('Sending confirmation emails to unconfirmed users');

    const users = await this.prisma.user.findMany({
      where: {
        emailConfirmed: false,
        emailConfirmationSentAt: {
          equals: null,
        },
      },
    });

    this.logger.log(`Found ${users.length} unconfirmed users`);

    const promises = users.map((user) =>
      this.emailConfirmationService.sendConfirmationEmail(user),
    );

    await Promise.all(promises);
    this.logger.log('Confirmation emails sent successfully');
  }
}
