import { ForbiddenException } from '@nestjs/common';

export class AgeLimitException extends ForbiddenException {
  constructor() {
    super('age_limit', 'You need to confirm your age to generate this coupon.');
  }
}
