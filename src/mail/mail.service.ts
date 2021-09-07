import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async sendTestMail() {
    await this.mailerService.sendMail({
      to: 'gasper@orb.si',
      subject: 'Fundl test email',
      template: './test',
    });
  }

  async sendConfirmMail(email: string, token: string) {
    const url = this.configService.get('MAIL_CONFIRM_URL');
    if (!url) {
      throw new Error('There was an error sending the confirmation email');
    }
    const user = await this.userService.getUser({ email });
    return this.mailerService.sendMail({
      to: user.email,
      subject: 'Potrditev e-poštnega naslova',
      template: './email',
      context: {
        name: user.profile.firstName,
        url: `${url}${token}`,
      },
    });
  }
}
