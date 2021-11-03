import { Field, InputType } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

@InputType()
export class CreateDiscountDto {
  @IsNotEmpty()
  @IsString()
  @Field()
  name: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  description: string;

  @IsNotEmpty()
  @Field()
  shopId: number;

  @IsInt()
  @Min(1)
  @Field({ nullable: true })
  max?: number;

  @IsInt()
  @Min(1)
  @Field({ nullable: true })
  parts?: number;
}
