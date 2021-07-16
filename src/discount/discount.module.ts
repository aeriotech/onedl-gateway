import { Module } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { CouponController } from './coupon/coupon.controller';
import { DiscountController } from './discount.controller';

@Module({
  providers: [DiscountService],
  controllers: [CouponController, DiscountController]
})
export class DiscountModule {}
