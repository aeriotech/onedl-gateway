import { IsBoolean, IsEmail, IsNotEmpty, Length } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @Length(4)
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(8)
  password: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsBoolean()
  @IsNotEmpty()
  ageConfirmed: boolean;
}
