import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

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
  @Min(1)
  max?: number;

  @IsInt()
  @Min(1)
  parts?: number;
}
