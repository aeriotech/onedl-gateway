import { Field, InputType, Int } from '@nestjs/graphql';
import { PartialType } from '@nestjs/swagger';
import { IsInt, IsUrl } from 'class-validator';
import { CreatePostDto } from './create-post.dto';

@InputType()
export class UpdatePostDto extends PartialType(CreatePostDto) {
  @IsUrl()
  @Field()
  url?: string;

  @IsInt()
  @Field((type) => Int)
  imageId?: number;
}
