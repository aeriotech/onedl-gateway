import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsString } from 'class-validator';

@InputType()
export class CreateCommingSoonDto {
  @Field()
  @IsString()
  name: string;

  @Field((type) => Int)
  @IsInt()
  imageId: number;

  @Field()
  public: boolean;
}
