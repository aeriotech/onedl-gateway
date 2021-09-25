import { IsNotEmpty, MaxLength } from 'class-validator';

export class AuthLoginDto {
  @IsNotEmpty()
  @MaxLength(20)
  username: string;

  @IsNotEmpty()
  @MaxLength(64)
  password: string;
}
