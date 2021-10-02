import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Profile as PrismaProfile } from '@prisma/client';
import { PublicFile } from 'src/files/models/public-file.model';

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

  @Field((type) => PublicFile, { nullable: true })
  profilePicture: PublicFile;
  profilePictureId: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
