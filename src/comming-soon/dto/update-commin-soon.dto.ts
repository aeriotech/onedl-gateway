import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsString } from 'class-validator';

@InputType()
export class UpdateCommingSoonDto {
  @Field({ nullable: true })
  @IsString()
  name?: string;

  @Field((type) => Int, { nullable: true })
  @IsInt()
  imageId?: number;

  @Field({ nullable: true })
  public?: boolean;
}
