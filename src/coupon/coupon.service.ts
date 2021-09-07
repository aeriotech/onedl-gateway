import { Injectable } from '@nestjs/common';
import { Coupon, Prisma } from '@prisma/client';
import * as dayjs from 'dayjs';
import { DiscountService } from 'src/discount/discount.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { Coupons } from './models/coupons.model';
import { PublicCoupon } from './models/public.coupon.model';

@Injectable()
export class CouponService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly discountService: DiscountService,
    private readonly userService: UserService,
  ) {}

  private readonly public: Prisma.CouponSelect = {
    public: true,
    validTo: true,
    discount: true,
    createdAt: true,
  };

  async getCoupons(user: Prisma.UserWhereUniqueInput): Promise<Coupons> {
    await this.userService.checkUser(user);
    const coupons = (await this.prisma.coupon.findMany({
      where: {
        user,
      },
      select: this.public,
    })) as unknown as Array<PublicCoupon>;

    return {
      coupons,
    };
  }

  async getPublicCoupon(
    where: Prisma.CouponWhereUniqueInput,
  ): Promise<PublicCoupon> {
    return this.prisma.coupon.findUnique({
      where,
      select: this.public,
    }) as unknown as Promise<PublicCoupon>;
  }

  async generateCoupon(
    userId: number,
    where: Prisma.DiscountWhereUniqueInput,
  ): Promise<Coupon> {
    const discount = await this.discountService.getDiscount(where);
    const validTo = discount.validTime
      ? dayjs().add(discount.validTime, 'hour').toISOString()
      : null;
    const coupon = await this.prisma.coupon.create({
      data: {
        validTo,
        discountId: discount.id,
        userId: userId,
      },
    });
    return coupon;
  }
}
