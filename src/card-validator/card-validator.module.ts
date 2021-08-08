import { HttpModule, Module } from '@nestjs/common';
import { CardValidatorService } from './card-validator.service';

@Module({
  imports: [HttpModule],
  providers: [CardValidatorService],
  exports: [HttpModule, CardValidatorService],
})
export class CardValidatorModule {}
