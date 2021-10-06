import { Field, InputType, Int } from '@nestjs/graphql';
import { bool } from 'aws-sdk/clients/signer';
import { IsBoolean, IsString } from 'class-validator';

@InputType()
export class UpdateShopDto {
  @Field()
  @IsString()
  name?: string;

  @Field()
  @IsBoolean()
  public?: bool;

  @Field((type) => Int)
  logoId?: number;
}
