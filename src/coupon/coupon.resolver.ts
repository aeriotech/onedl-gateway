import { UseGuards } from '@nestjs/common';
import {
  Args,
  Field,
  InputType,
  Int,
  Query,
  ResolveField,
  Resolver,
  Root,
} from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { IsInt } from 'class-validator';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoleGuard } from 'src/role/role.guard';
import { Coupon } from './models/coupon.model';

@InputType()
class CouponUniqueInput {
  @IsInt()
  @Field((type) => Int, { nullable: true })
  id: number;
}

@Resolver(Coupon)
export class CouponResolver {
  constructor(private readonly prisma: PrismaService) {}

  @ResolveField()
  async discount(@Root() coupon: Coupon) {
    return await this.prisma.coupon
      .findUnique({
        where: { id: coupon.id },
      })
      .discount();
  }

  @ResolveField()
  async user(@Root() coupon: Coupon) {
    return await this.prisma.coupon
      .findUnique({
        where: { id: coupon.id },
      })
      .user();
  }

  @UseGuards(RoleGuard(Role.ADMIN, Role.EDITOR))
  @Query((returns) => [Coupon])
  async coupons() {
    return await this.prisma.coupon.findMany();
  }

  @UseGuards(RoleGuard(Role.ADMIN, Role.EDITOR))
  @Query((returns) => Coupon)
  async coupon(
    @Args('where', { type: () => CouponUniqueInput })
    couponUniqueInput: CouponUniqueInput,
  ) {
    return await this.prisma.coupon.findUnique({
      where: couponUniqueInput,
    });
  }
}
