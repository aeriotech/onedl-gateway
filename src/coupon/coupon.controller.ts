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
import { ApplyUser } from 'src/auth/apply-user.guard';
import { Public } from 'src/auth/public.decorator';
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

  @Get()
  @ApiBearerAuth('User')
  @ApiBearerAuth('Admin')
  @UseInterceptors(PublicFilter(PublicCoupon))
  @UseGuards(ApplyUser)
  @Public()
  getCoupons(@UserId() userId: number) {
    return this.couponService.getPublicCoupons(userId);
  }

  @Get(':discountUuid')
  @ApiBearerAuth('User')
  @ApiBearerAuth('Admin')
  @UseInterceptors(PublicFilter(PublicCoupon))
  @UseGuards(ApplyUser)
  @Public()
  getDiscountCoupons(
    @UserId() userId: number,
    @Param('discountUuid') discountUuid: string,
  ) {
    return this.couponService.getPublicCoupons(userId, discountUuid);
  }

  @ApiBearerAuth('Admin')
  @UseGuards(RoleGuard(Role.ADMIN))
  @Post('bulk')
  async bulkAddCoupons(@Body() body: BulkCreateCouponDto) {
    return this.couponService.bulkAddCoupons(body);
  }
}
