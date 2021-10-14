import { Daily } from '.prisma/client';
import { Expose } from 'class-transformer';

export class PublicDaily implements Daily {
  id: number;

  @Expose()
  uuid: string;

  @Expose()
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
