import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { DiscountService } from '../discount.service';
import { CreateDiscountDto } from '../dto/create-discount.dto';
import { mockDiscount, mockDiscounts } from '../mock/discount.mock';

const prismaMock = {
  discount: {
    create: jest.fn().mockReturnValue(mockDiscount),
    delete: jest.fn().mockReturnValue(mockDiscount),
  },
};

describe('DiscountService', () => {
  let service: DiscountService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiscountService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<DiscountService>(DiscountService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a discount', async () => {
      const response = await service.createDiscount(mockDiscount);
      expect(response).toEqual(mockDiscount);
    });
  });

  describe('delete', () => {
    it('should delete the discount', async () => {
      const response = await service.deleteDiscount(mockDiscount);
      expect(response).toEqual(mockDiscount);
    });
  });

  describe('get', () => {
    it('should return the discount', async () => {
      const response = await service.getDiscount(mockDiscount);
      expect(response).toEqual(mockDiscount);
    });
  });

  describe('getAll', () => {
    it('should return all discounts', async () => {
      const response = await service.getDiscounts();
      expect(response).toEqual(mockDiscounts);
    });
  });
});
