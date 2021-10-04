import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import handlePrismaError from 'src/utils/prisma-error-handler';

@Injectable()
export class AgeConfirmationService {
  constructor(private readonly userService: UserService) {}

  async confirmEmso(userId: number, emso: string) {
    if (!emso.length) {
      throw new NotFoundException('Please enter an emso');
    }

    const valid = this.validateEmso(emso);
    if (!valid) {
      throw new BadRequestException('Invalid emso');
    }

    const birthDate = this.extractDate(emso);
    const hashedEmso = this.hashEmso(emso).toString();

    try {
      const user = await this.userService.update(
        {
          id: userId,
        },
        {
          ageConfirmed: true,
          birthDate,
          emso: hashedEmso,
        },
      );

      return user;
    } catch (e) {
      handlePrismaError(e, 'Emso');
    }
  }

  hashEmso(emso: string): number {
    let hash = 0,
      i,
      chr;
    if (emso.length === 0) return hash;
    for (i = 0; i < emso.length; i++) {
      chr = emso.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0;
    }
    return hash;
  }

  validateEmso(emso: string): boolean {
    const emsoArray = emso.split('').map(Number);
    const validationNumber = emsoArray.pop();
    const multipliers = [7, 6, 5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    const multiplied = emsoArray.map(
      (value, index) => value * multipliers[index],
    );
    const sum = multiplied.reduce((a, b) => a + b, 0);

    let calcV = 11 - (sum % 11);
    calcV = calcV === 10 ? 0 : calcV;

    return calcV === validationNumber;
  }

  extractDate(emso: string): Date {
    const emsoArray = emso.split('').map(Number);
    const day = emsoArray.slice(0, 2).join('');
    const month = emsoArray.slice(2, 4).join('');
    let year = emsoArray.slice(4, 7).join('');
    const currentYear = new Date().getFullYear().toString().substring(0, 3);
    year = Number(year) > Number(currentYear) ? '1' + year : '2' + year;
    return new Date(`${year}-${month}-${day}`);
  }
}
