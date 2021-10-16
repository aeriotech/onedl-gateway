import { DailyDiscountMap as DailyDiscountMapPrisma } from '@prisma/client';
import { Expose } from 'class-transformer';
import { PublicDiscount } from 'src/discount/models/public-discount.model';
import { PublicFile } from 'src/files/models/public-file.model';

export class DailyDiscountMap implements DailyDiscountMapPrisma {
  id: number;
  dailyId: number;
  probability: number;
  countTrigger: number;

  @Expose()
  discount: PublicDiscount;
  discountId: number;

  @Expose()
  image: PublicFile;
  imageId: number;

  @Expose()
  title: string;

  @Expose()
  description: string;

  availableFrom: Date;
  availableTo: Date;
  createdAt: Date;
  updatedAt: Date;
}
