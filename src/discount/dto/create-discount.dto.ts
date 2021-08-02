import { Shop } from '@prisma/client';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateDiscountDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  shopId: number;

  @IsInt()
  max?: number;

  @IsInt()
  parts?: number;
}
