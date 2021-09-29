import { ApiProperty } from '@nestjs/swagger';
import { Plan, Role } from '@prisma/client';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsJWT,
  IsString,
  Length,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @Length(4)
  username?: string;

  @IsEmail()
  email?: string;

  @IsString()
  @Length(8)
  password?: string;

  @ApiProperty({ enum: Role })
  @IsEnum(Role)
  role?: Role;

  @ApiProperty({ enum: Plan })
  @IsEnum(Plan)
  plan?: Plan;

  @IsBoolean()
  emailConfirmed?: boolean;

  @IsBoolean()
  ageConfirmed?: boolean;

  @IsJWT()
  forgotPasswordToken?: string;
}
