import { IsString } from 'class-validator';

export class ProfileUpdateDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  bio: string;
}
