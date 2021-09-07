import { PublicDiscount } from 'src/discount/models/public-discount.model';

export class PublicCoupon {
  public: boolean;
  validTo: Date;
  discount: PublicDiscount;
  createdAt: Date;
}
