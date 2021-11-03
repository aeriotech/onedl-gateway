import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsEmpty, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class UpdateDiscountDto {
  @IsString()
  @Field({ nullable: true })
  name?: string;

  @IsString()
  @Field({ nullable: true })
  description?: string;

  @IsBoolean()
  @Field({ nullable: true })
  public?: boolean;
}
