import { Daily } from '.prisma/client';
import { DateTime } from 'aws-sdk/clients/devicefarm';
import { Expose } from 'class-transformer';
import { PublicFile } from 'src/files/models/public-file.model';

export class PublicDaily implements Daily {
  id: number;

  @Expose()
  uuid: string;

  @Expose()
  name: string;

  @Expose()
  background: PublicFile;
  backgroundId: number;

  public: boolean;

  availableFrom: DateTime;
  availableTo: DateTime;

  createdAt: Date;
  updatedAt: Date;
}
