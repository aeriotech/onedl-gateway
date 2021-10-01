import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CardValidatorService } from './card-validator.service';

@Module({
  imports: [HttpModule],
  providers: [CardValidatorService],
  exports: [HttpModule, CardValidatorService],
})
export class CardValidatorModule {}
