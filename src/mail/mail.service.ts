import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly userService: UserService,
  ) {}

  async sendTestMail() {
    await this.mailerService.sendMail({
      to: 'gasper@orb.si',
      subject: 'Fundl test email',
      template: './test',
    });
  }

  async sendEmailConfirmMail(userId: number) {
    const user = await this.userService.getUser({ id: userId });

    return this.mailerService.sendMail({
      to: user.email,
      subject: 'Email confirmation',
      template: './email',
      context: {
        name: user.profile.firstName,
        url: 'https://fundl.io/confirm',
      },
    });
  }
}
