import { IsJWT, IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsJWT()
  code: string;

  @IsString()
  password: string;
}
