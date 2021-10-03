import { Field, InputType, Int } from '@nestjs/graphql';
import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsUrl } from 'class-validator';
import { CreatePostDto } from './create-post.dto';

@InputType()
export class UpdatePostDto extends PartialType(CreatePostDto) {
  @IsUrl()
  @Field({ nullable: true })
  url?: string;

  @IsInt()
  @Field((type) => Int, { nullable: true })
  imageId?: number;

  @IsBoolean()
  @Field({ nullable: true })
  public?: boolean;
}
