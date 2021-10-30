import { Category } from '@prisma/client';
import { Expose } from 'class-transformer';
import { PublicDiscount } from 'src/discount/models/public-discount.model';
import { PublicFile } from 'src/files/models/public-file.model';

export class PublicCategory implements Category {
  id: number;
  @Expose()
  uuid: string;
  @Expose()
  name: string;
  createdAt: Date;
  display: boolean;
  updatedAt: Date;
  backgroundId: number;
  @Expose()
  background: PublicFile;
  @Expose()
  discounts: PublicDiscount[];
}
