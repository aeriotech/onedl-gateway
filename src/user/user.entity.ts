import {
  IsEmail,
  IsNotEmpty,
  IsNotEmptyObject,
  IsString,
} from 'class-validator'
import { Profile } from 'src/profile/profile.entity'

export class PublicUser {
  @IsString()
  @IsNotEmpty()
  username: string

  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsNotEmptyObject()
  profile: Profile
}
