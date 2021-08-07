import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendTestMail() {
    await this.mailerService.sendMail({
      to: 'gasper@orb.si',
      subject: 'Fundl test email',
      template: './test',
    });
  }
}
