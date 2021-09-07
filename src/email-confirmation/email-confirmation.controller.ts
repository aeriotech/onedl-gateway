import { Body, Controller, Post } from '@nestjs/common';
import { ConfirmEmailDto } from './dtos/confirm-email.dto';
import { EmailConfirmationService } from './email-confirmation.service';

@Controller('email-confirmation')
export class EmailConfirmationController {
  constructor(
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @Post()
  async confirmEmail(@Body() confirmationData: ConfirmEmailDto) {
    return await this.emailConfirmationService.confirmEmail(confirmationData);
  }
}
