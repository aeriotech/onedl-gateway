import { ComingSoon, PublicFile } from '@prisma/client';
import { Expose } from 'class-transformer';

export class PublicComminSoon implements ComingSoon {
  id: number;

  @Expose()
  name: string;

  @Expose()
  image: PublicFile;

  imageId: number;
  public: boolean;
  createdAt: Date;
  updatedAt: Date;
}
