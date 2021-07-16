import { IsEmail, IsNotEmpty } from 'class-validator'

export class RegisterDto {
  @IsNotEmpty()
  username: string

  @IsEmail()
  email: string

  @IsNotEmpty()
  password: string

  @IsNotEmpty()
  firstName: string

  @IsNotEmpty()
  lastName: string
}
