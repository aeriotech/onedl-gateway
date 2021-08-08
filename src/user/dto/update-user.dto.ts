import { Plan, Role } from '@prisma/client';
import { IsEmail, IsEnum, IsString, Length, NotEquals } from 'class-validator';

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
}
