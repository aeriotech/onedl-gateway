import { IsBoolean, IsEmpty, IsNotEmpty, IsString } from 'class-validator';

export class UpdateDiscountDto {
  @IsString()
  name?: string;

  @IsString()
  description?: string;

  @IsBoolean()
  public?: boolean;
}
