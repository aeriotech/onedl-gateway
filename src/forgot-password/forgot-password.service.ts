import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { UserService } from 'src/user/user.service';
import { ForgotPasswordPayload } from './interfaces/forgot-password-payload.interface';

@Injectable()
export class ForgotPasswordService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly userService: UserService,
  ) {}

  private logger = new Logger('ForgotPasswordService');

  async forgotPassword(email: string) {
    this.logger.log(`Forgot password for ${email}`);
    const payload: ForgotPasswordPayload = { email };
    const token = this.jwtService.sign(payload);
    this.sendMail(email, token);
  }

  async sendMail(email: string, token: string) {
    try {
      await this.mailService.sendForgotPasswordMail(email, token);
      this.logger.verbose(`Forgot password email sent to ${email}`);
      await this.userService.updateUser(
        { email },
        { forgotPasswordToken: token },
      );
    } catch (error) {
      this.logger.warn(`Email ${email} doesn't exist, skipping mail send`);
    }
  }

  async resetPassword(token: string, password: string) {
    const email = this.decodeToken(token);
    const user = await this.userService.getUser({ email });
    this.logger.verbose(`Reset password for ${email}`);
    if (user.forgotPasswordToken !== token) {
      this.logger.warn(`Token doesn't match saved token`);
      throw new BadRequestException('Invalid token');
    }
    await this.userService.updateUser(
      { email },
      { password, forgotPasswordToken: undefined },
    );
    this.logger.verbose(`Password for ${email} has been updated`);
  }

  decodeToken(token: string) {
    try {
      const payload: ForgotPasswordPayload = this.jwtService.verify(token);

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Password reset token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }
}