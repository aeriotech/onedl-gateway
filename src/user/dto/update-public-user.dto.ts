import { IsEmail, IsString, Length, NotEquals } from 'class-validator';

export class UpdatePublicUserDto {
  @IsString()
  @Length(4)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(8)
  password: string;
}
