import { IsNotEmpty, MaxLength } from 'class-validator';

export class AuthLoginDto {
  @IsNotEmpty()
  @MaxLength(50)
  username: string;

  @IsNotEmpty()
  @MaxLength(64)
  password: string;
}
