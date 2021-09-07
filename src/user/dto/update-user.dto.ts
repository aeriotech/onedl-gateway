import { Plan, Role } from '@prisma/client';
import { IsBoolean, IsEmail, IsEnum, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @Length(4)
  username?: string;

  @IsEmail()
  email?: string;

  @IsString()
  @Length(8)
  password?: string;

  @IsEnum(Role)
  role?: Role;

  @IsEnum(Plan)
  plan?: Plan;

  @IsBoolean()
  emailConfirmed?: boolean;

  @IsBoolean()
  phoneConfirmed?: boolean;
}
