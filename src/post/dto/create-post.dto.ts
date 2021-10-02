import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsUrl } from 'class-validator';

@InputType()
export class CreatePostDto {
  @IsUrl()
  @Field()
  url?: string;

  @IsInt()
  @Field((type) => Int)
  imageId?: number;
}
