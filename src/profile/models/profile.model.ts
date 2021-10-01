import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Profile as PrismaProfile } from '@prisma/client';

@ObjectType()
export class Profile implements PrismaProfile {
  @Field((type) => Int)
  id: number;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  bio: string;

  profilePictureId: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
