import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Plan, Role } from '@prisma/client';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsHash,
  IsInt,
  IsJWT,
  IsString,
  Length,
} from 'class-validator';

@InputType()
export class UpdateUserDto {
  @IsString()
  @Length(4)
  @Field({ nullable: true })
  username?: string;

  @IsEmail()
  @Field({ nullable: true })
  email?: string;

  @IsString()
  @Length(8)
  @Field({ nullable: true })
  password?: string;

  @ApiProperty({ enum: Role })
  @IsEnum(Role)
  @Field({ nullable: true })
  role?: Role;

  @ApiProperty({ enum: Plan })
  @IsEnum(Plan)
  @Field({ nullable: true })
  plan?: Plan;

  @IsBoolean()
  @Field({ nullable: true })
  emailConfirmed?: boolean;

  @IsDate()
  @Field({ nullable: true })
  emailConfirmationSentAt?: Date;

  @IsBoolean()
  @Field({ nullable: true })
  ageConfirmed?: boolean;

  @IsInt()
  @Field({ nullable: true })
  score?: number;

  @IsString()
  @Field({ nullable: true })
  emso?: string;

  @IsDate()
  @Field({ nullable: true })
  birthDate?: Date;

  @IsJWT()
  @Field({ nullable: true })
  forgotPasswordToken?: string;
}
