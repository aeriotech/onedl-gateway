import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsInt, IsString } from 'class-validator';

@InputType()
export class UpdateDiscountDto {
  @IsString()
  @Field({ nullable: true })
  name?: string;

  @IsString()
  @Field({ nullable: true })
  description?: string;

  @IsInt()
  @Field({ nullable: true })
  imageId?: number;

  @IsInt()
  @Field({ nullable: true })
  thumbnailId?: number;

  @IsBoolean()
  @Field({ nullable: true })
  public?: boolean;
}
