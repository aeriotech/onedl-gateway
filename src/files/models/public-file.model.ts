import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PublicFile as PrismaPublicFile } from '@prisma/client';

@ObjectType()
export class PublicFile implements PrismaPublicFile {
  @Field(() => Int)
  id: number;

  @Field()
  url: string;

  @Field()
  key: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
