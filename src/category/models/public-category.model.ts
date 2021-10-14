import { Category } from '@prisma/client';
import { Expose } from 'class-transformer';
import { PublicFile } from 'src/files/models/public-file.model';

export class PublicCategory implements Category {
  id: number;
  @Expose()
  uuid: string;
  @Expose()
  name: string;
  createdAt: Date;
  updatedAt: Date;
  backgroundId: number;
  @Expose()
  background: PublicFile;
}
