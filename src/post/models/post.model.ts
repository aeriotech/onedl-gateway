import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Post as PrismaPost } from '@prisma/client';
import { PublicFile } from 'src/files/models/public-file.model';

@ObjectType()
export class Post implements PrismaPost {
  @Field((type) => Int)
  id: number;

  @Field()
  url: string;

  @Field((type) => Int)
  imageId: number;

  @Field((type) => PublicFile)
  image: PublicFile;

  @Field()
  public: boolean;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  updatedAt: Date;
}
