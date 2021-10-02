import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Profile as PrismaProfile } from '@prisma/client';
import { PublicFile } from 'src/files/models/public-file.model';
import { User } from 'src/user/models/user.model';

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

  @Field((type) => User, { nullable: true })
  user: User;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
