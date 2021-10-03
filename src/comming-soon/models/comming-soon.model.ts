import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CommingSoon as ComminSoonPrisma } from '@prisma/client';
import { PublicFile } from 'src/files/models/public-file.model';

@ObjectType()
export class CommingSoon implements ComminSoonPrisma {
  @Field((type) => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  image: PublicFile;

  @Field((type) => Int)
  imageId: number;

  @Field()
  public: boolean;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  updatedAt: Date;
}
