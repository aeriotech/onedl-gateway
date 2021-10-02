import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/role/role.guard';
import { UserId } from 'src/user/user.decorator';
import { PublicFilter } from 'src/utils/filter.interceptor';
import { CouponService } from './coupon.service';
import { BulkCreateCouponDto } from './dtos/bulk-create-coupon.dto';
import { PublicCoupon } from './models/public-coupon.model';

@ApiTags('Coupon')
@Controller('coupons')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @ApiBearerAuth('User')
  @ApiBearerAuth('Admin')
  @UseInterceptors(PublicFilter(PublicCoupon))
  @Public()
  @Get()
  getCoupons(@UserId() userId: number) {
    return this.couponService.getPublicCoupons(userId);
  }

  @ApiBearerAuth('Admin')
  @UseGuards(RoleGuard(Role.ADMIN))
  @Post('bulk')
  async bulkAddCoupons(@Body() body: BulkCreateCouponDto) {
    return this.couponService.bulkAddCoupons(body);
  }

  @ApiBearerAuth('Admin')
  @Get(':username')
  @UseGuards(JwtAuthGuard, RoleGuard(Role.ADMIN))
  async getUserCoupon(@Param('username') username: string) {
    return this.couponService.getCoupons({ username });
  }
}
