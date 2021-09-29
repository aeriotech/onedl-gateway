import { Module } from '@nestjs/common';
import { AgeConfirmationService } from './age-confirmation.service';
import { AgeConfirmationController } from './age-confirmation.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  providers: [AgeConfirmationService],
  controllers: [AgeConfirmationController],
})
export class AgeConfirmationModule {}
