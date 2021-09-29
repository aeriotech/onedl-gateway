import { ForbiddenException } from '@nestjs/common';

export class AgeLimitException extends ForbiddenException {
  constructor() {
    super('You need to confirm your age to generate this coupon.', 'age_limit');
  }
}
