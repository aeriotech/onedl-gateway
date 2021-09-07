import { Discount } from '.prisma/client';
import { Expose } from 'class-transformer';

export class PublicDiscount implements Discount {
  id: number;
  @Expose()
  name: string;
  max: number;
  parts: number;
  public: boolean;
  validFrom: Date;
  validTo: Date;
  validTime: number;
  categoryUuid: string;
  thumbnailId: number;
  shopId: number;
  createdAt: Date;
  updatedAt: Date;
}
