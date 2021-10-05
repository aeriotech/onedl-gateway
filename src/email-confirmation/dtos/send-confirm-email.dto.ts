import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendConfirmEmailDto {
  @IsNotEmpty()
  email: string;
}
