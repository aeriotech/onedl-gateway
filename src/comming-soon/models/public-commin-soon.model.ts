import { CommingSoon, PublicFile } from '@prisma/client';
import { Expose } from 'class-transformer';

export class PublicComminSoon implements CommingSoon {
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
