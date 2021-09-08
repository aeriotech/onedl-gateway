import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/role/role.guard';
import { UserId } from 'src/user/user.decorator';
import { CouponService } from './coupon.service';

@ApiTags('Coupon')
@Controller('coupons')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @ApiBearerAuth('User')
  @ApiBearerAuth('Admin')
  @UseGuards(JwtAuthGuard)
  @Get()
  async getCoupons(@UserId() userId: number) {
    return this.couponService.getCoupons({ id: userId });
  }

  @ApiBearerAuth('Admin')
  @Get(':username')
  @UseGuards(JwtAuthGuard, RoleGuard(Role.ADMIN))
  async getUserCoupon(@Param('username') username: string) {
    return this.couponService.getCoupons({ username });
  }
}
