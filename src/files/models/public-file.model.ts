import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ApiHideProperty } from '@nestjs/swagger';
import { PublicFile as PrismaPublicFile } from '@prisma/client';

@ObjectType()
export class PublicFile implements PrismaPublicFile {
  @ApiHideProperty()
  @Field(() => Int)
  id: number;

  @Field()
  url: string;

  @ApiHideProperty()
  @Field()
  key: string;

  @ApiHideProperty()
  @Field()
  createdAt: Date;

  @ApiHideProperty()
  @Field()
  updatedAt: Date;
}
