import { Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { CardValidatorModule } from 'src/card-validator/card-validator.module';
import { FilesModule } from 'src/files/files.module';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [CardValidatorModule, FilesModule],
  providers: [PlanService, UserService],
  controllers: [PlanController],
})
export class PlanModule {}
