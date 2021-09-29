import { Controller, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserId } from 'src/user/user.decorator';
import { AgeConfirmationService } from './age-confirmation.service';

@ApiTags('Age Confirmation')
@Controller('age-confirmation')
export class AgeConfirmationController {
  constructor(
    private readonly ageConfirmationService: AgeConfirmationService,
  ) {}

  @ApiBearerAuth('Admin')
  @ApiBearerAuth('User')
  @Post('emso/:emso')
  confirmEMSO(@UserId() userId: number, @Param('emso') emso: string) {
    this.ageConfirmationService.confirmEMSO(userId, emso);
  }
}
