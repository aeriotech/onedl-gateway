import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  Length,
  MaxLength,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @Length(4, 20)
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(8, 64)
  password: string;

  @IsNotEmpty()
  @MaxLength(20)
  firstName: string;

  @IsNotEmpty()
  @MaxLength(20)
  lastName: string;
}
