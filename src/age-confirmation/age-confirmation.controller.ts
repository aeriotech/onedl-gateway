import { Controller, Param, Post, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PublicUser } from 'src/user/models/public-user.model';
import { UserId } from 'src/user/user.decorator';
import { PublicFilter } from 'src/utils/filter.interceptor';
import { AgeConfirmationService } from './age-confirmation.service';

@ApiTags('Age Confirmation')
@Controller('age-confirmation')
export class AgeConfirmationController {
  constructor(
    private readonly ageConfirmationService: AgeConfirmationService,
  ) {}

  @ApiBearerAuth('Admin')
  @ApiBearerAuth('User')
  @UseInterceptors(PublicFilter(PublicUser))
  @Post('emso/:emso')
  async confirmEMSO(@UserId() userId: number, @Param('emso') emso: string) {
    await this.ageConfirmationService.confirmEmso(userId, emso);
  }
}
