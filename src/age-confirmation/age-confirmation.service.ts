import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AgeConfirmationService {
  constructor(private readonly userService: UserService) {}

  async confirmEMSO(userId: number, emso: string) {
    this.userService.update(
      { id: userId },
      {
        ageConfirmed: true,
      },
    );
  }
}
