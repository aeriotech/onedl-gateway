import { Post } from '.prisma/client';
import { ApiHideProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { PublicFile } from 'src/files/models/public-file.model';

export class PublicPost implements Post {
  @ApiHideProperty()
  id: number;

  @Expose()
  url: string;

  @Expose()
  image: PublicFile;

  @ApiHideProperty()
  imageId: number;

  @ApiHideProperty()
  public: boolean;

  @ApiHideProperty()
  createdAt: Date;

  @ApiHideProperty()
  updatedAt: Date;
}
