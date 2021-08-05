import { Test, TestingModule } from '@nestjs/testing';
import { DailyController } from './daily.controller';

describe('DailyController', () => {
  let controller: DailyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DailyController],
    }).compile();

    controller = module.get<DailyController>(DailyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // it('should return that the daily discount is available', async () => {
  //   const available = await controller.available();
  //   expect(available).toBe('');
  // });
});
