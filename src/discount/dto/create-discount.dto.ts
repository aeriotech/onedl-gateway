import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateDiscountDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  shopId: number;

  @IsInt()
  max?: number;

  @IsInt()
  parts?: number;
}
