import { Discount, PublicFile } from '.prisma/client';
import { Expose } from 'class-transformer';
import { PublicCoupon } from 'src/coupon/models/public-coupon.model';

export class PublicDiscount implements Discount {
  id: number;
  @Expose()
  uuid: string;
  @Expose()
  name: string;
  @Expose()
  description: string;
  max: number;
  maxPerUser: number;
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
  createdAt: Date;
  updatedAt: Date;
}
