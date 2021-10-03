import { Field, InputType, Int } from '@nestjs/graphql';
import { IsBoolean, IsInt, IsUrl } from 'class-validator';

@InputType()
export class CreatePostDto {
  @IsUrl()
  @Field({ nullable: true })
  url?: string;

  @IsInt()
  @Field((type) => Int)
  imageId?: number;

  @IsBoolean()
  @Field()
  public?: boolean;
}
