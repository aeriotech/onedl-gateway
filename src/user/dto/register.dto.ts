import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  Length,
  NotEquals,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @Length(4)
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @IsNotEmpty()
  @Length(8)
  password: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;
}
