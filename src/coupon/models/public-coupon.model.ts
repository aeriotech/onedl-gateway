import { Coupon } from '.prisma/client';
import { Expose } from 'class-transformer';
import { PublicDiscount } from 'src/discount/models/public-discount.model';

export class PublicCoupon implements Coupon {
  id: number;
  @Expose()
  discountUuid: string;
  @Expose()
  code: string;
  used: boolean;
  discountId: number;
  userId: number;
  updatedAt: Date;
  public: boolean;
  @Expose()
  validTo: Date;
  @Expose()
  discount: PublicDiscount;
  @Expose()
  createdAt: Date;
}
