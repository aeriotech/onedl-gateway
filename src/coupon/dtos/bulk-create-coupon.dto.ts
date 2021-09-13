import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class BulkCreateCouponDto {
  @IsNotEmpty()
  @IsArray()
  codes: string[];

  @IsNotEmpty()
  @IsString()
  discountUuid: string;
}
