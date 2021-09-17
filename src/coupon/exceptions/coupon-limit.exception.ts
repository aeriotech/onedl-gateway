import { ForbiddenException } from '@nestjs/common';

export class CouponLimitException extends ForbiddenException {
  constructor() {
    super('coupon_limit', `Can't generate more coupons`);
  }
}
