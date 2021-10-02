import { Field, InputType } from '@nestjs/graphql';
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

  @IsBoolean()
  @Field({ nullable: true })
  ageConfirmed?: boolean;

  @IsJWT()
  @Field({ nullable: true })
  forgotPasswordToken?: string;
}
