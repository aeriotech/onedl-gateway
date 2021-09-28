import { Expose } from 'class-transformer';

export class CouponState {
  @Expose()
  all: number;
  @Expose()
  used: number;
  @Expose()
  free: number;
}
