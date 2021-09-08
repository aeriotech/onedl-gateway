import { Body, Controller, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { ForgotPasswordService } from './forgot-password.service';

@ApiTags('Forgot Password')
@Controller('forgot-password')
export class ForgotPasswordController {
  constructor(private readonly forgotPasswordService: ForgotPasswordService) {}

  @Post()
  async forgotPassword(@Body() { email }: ForgotPasswordDto) {
    return await this.forgotPasswordService.forgotPassword(email);
  }

  @Put()
  async resetPassword(@Body() { code, password }: ResetPasswordDto) {
    return await this.forgotPasswordService.resetPassword(code, password);
  }
}
