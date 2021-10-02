import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Shop as PrismaShop } from '@prisma/client';
import { PublicFile } from 'src/files/models/public-file.model';

@ObjectType()
export class Shop implements PrismaShop {
  @Field((type) => Int)
  id: number;

  @Field()
  uuid: string;

  @Field()
  name: string;

  @Field((type) => PublicFile, { nullable: true })
  logo: PublicFile;
  logoId: number;

  @Field((type) => Boolean)
  public: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
