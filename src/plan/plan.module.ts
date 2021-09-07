import { Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { CardValidatorModule } from 'src/card-validator/card-validator.module';
import { FilesModule } from 'src/files/files.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [CardValidatorModule, FilesModule, UserModule],
  providers: [PlanService],
  controllers: [PlanController],
})
export class PlanModule {}
