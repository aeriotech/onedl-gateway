import { IsEmail, IsNotEmpty, Length, NotEquals } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @Length(4)
  username: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(8)
  password: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;
}
