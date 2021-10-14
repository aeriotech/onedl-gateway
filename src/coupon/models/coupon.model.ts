import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Coupon as PrismaCoupon } from '@prisma/client';
import { Discount } from 'src/discount/models/discount.model';
import { User } from 'src/user/models/user.model';

@ObjectType()
export class Coupon implements PrismaCoupon {
  @Field((type) => Int)
  id: number;

  @Field()
  code: string;

  @Field()
  public: boolean;

  @Field()
  used: boolean;

  @Field()
  validTo: Date;

  @Field((type) => Discount)
  discount?: Discount;

  @Field()
  discountUuid: string;

  @Field((type) => User, { nullable: true })
  user?: User;
  userId: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
