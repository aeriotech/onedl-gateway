import { CouponType, Discount, DiscountType } from '.prisma/client';
import { Expose } from 'class-transformer';
import { PublicFile } from 'src/files/models/public-file.model';
import { PublicShop } from 'src/shop/models/public.shop.model';

export class PublicDiscount implements Discount {
  id: number;
  @Expose()
  uuid: string;
  @Expose()
  name: string;
  @Expose()
  description: string;
  @Expose()
  couponType: CouponType;
  @Expose()
  discountType: DiscountType;
  max: number;
  maxPerUser: number;
  ageLimit: boolean;
  parts: number;
  public: boolean;
  claimable: boolean;
  validFrom: Date;
  validTo: Date;
  validTime: number;
  @Expose()
  categoryUuid: string;
  thumbnailId: number;
  @Expose()
  thumbnail: PublicFile;
  imageId: number;
  @Expose()
  image: PublicFile;
  shopId: number;
  @Expose()
  shop: PublicShop;
  createdAt: Date;
  updatedAt: Date;
}
