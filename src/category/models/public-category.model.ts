import { Category } from '@prisma/client';
import { Expose } from 'class-transformer';

export class PublicCategory implements Category {
  id: number;
  uuid: string;
  @Expose()
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
