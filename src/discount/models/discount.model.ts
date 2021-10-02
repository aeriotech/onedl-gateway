import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { CouponType, Discount as PrismaDiscount } from '@prisma/client';
import { PublicFile } from 'src/files/models/public-file.model';
import { Shop } from 'src/shop/models/shop.model';

registerEnumType(CouponType, { name: 'CouponType' });

@ObjectType()
export class Discount implements PrismaDiscount {
  @Field((type) => Int)
  id: number;

  @Field()
  uuid: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field((type) => PublicFile)
  thumbnail: PublicFile;
  thumbnailId: number;

  @Field((type) => PublicFile)
  image: PublicFile;
  imageId: number;

  @Field()
  categoryUuid: string;

  @Field((type) => Shop)
  shop: Shop;
  shopId: number;

  @Field((type) => CouponType)
  couponType: CouponType;

  @Field((type) => Int, { nullable: true })
  maxPerUser: number;

  @Field((type) => Int, { nullable: true })
  max: number;

  @Field((type) => Int)
  parts: number;

  @Field()
  public: boolean;

  @Field()
  ageLimit: boolean;

  @Field({ nullable: true })
  validFrom: Date;

  @Field({ nullable: true })
  validTo: Date;

  @Field((type) => Int)
  validTime: number;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  updatedAt: Date;
}
