import { Field, InputType, Int } from '@nestjs/graphql';
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
  @IsInt()
  @Field((type) => Int)
  shopId: number;

  @IsNotEmpty()
  @Field((type) => Int, { nullable: true })
  imageId?: number;

  @IsNotEmpty()
  @IsInt()
  @Field((type) => Int, { nullable: true })
  thumbnailId?: number;

  @IsInt()
  @Min(1)
  @Field((type) => Int, { nullable: true })
  max?: number;

  @IsInt()
  @Min(1)
  @Field((type) => Int, { nullable: true })
  parts?: number;
}
