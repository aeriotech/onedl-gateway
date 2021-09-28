import { CouponType, Discount, PublicFile } from '.prisma/client';
import { Expose } from 'class-transformer';
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
  max: number;
  maxPerUser: number;
  ageLimit: boolean;
  parts: number;
  public: boolean;
  validFrom: Date;
  validTo: Date;
  validTime: number;
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
