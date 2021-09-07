import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Plan } from '@prisma/client';
import { CardValidatorService } from 'src/card-validator/card-validator.service';
import { FilesService } from 'src/files/files.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PlanService {
  constructor(
    private readonly cardValidatorService: CardValidatorService,
    private readonly filesService: FilesService,
    private readonly userService: UserService,
  ) {}

  async joinStudent(userId: number, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Card picture is missing');
    }

    const { key } = await this.filesService.uploadPrivateFile(
      file.buffer,
      file.originalname,
    );

    const valid = await this.cardValidatorService.validateCard(key);

    if (!valid) {
      throw new ForbiddenException('This card is not valid');
    }

    await this.userService.updateUser({ id: userId }, { plan: Plan.STUDENT });

    return this.userService.getPublicUser({ id: userId });
  }
}
