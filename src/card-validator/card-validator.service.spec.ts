import { Test, TestingModule } from '@nestjs/testing';
import { CardValidatorService } from './card-validator.service';

describe('CardValidatorService', () => {
  let service: CardValidatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardValidatorService],
    }).compile();

    service = module.get<CardValidatorService>(CardValidatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
