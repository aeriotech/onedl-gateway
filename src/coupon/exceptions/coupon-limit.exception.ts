import { ForbiddenException } from '@nestjs/common';

export class CouponLimitException extends ForbiddenException {
  constructor() {
    super(`Can't generate more coupons`, 'coupon_limit');
  }
}
