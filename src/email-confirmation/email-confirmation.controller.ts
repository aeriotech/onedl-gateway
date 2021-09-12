import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/public.decorator';
import { ConfirmEmailDto } from './dtos/confirm-email.dto';
import { EmailConfirmationService } from './email-confirmation.service';

@ApiTags('Email confirmation')
@Controller('email-confirmation')
export class EmailConfirmationController {
  constructor(
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @Post()
  @Public()
  async confirmEmail(@Body() confirmationData: ConfirmEmailDto) {
    return await this.emailConfirmationService.confirmEmail(confirmationData);
  }
}
