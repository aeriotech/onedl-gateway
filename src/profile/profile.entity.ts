import { IsNotEmpty, IsNotEmptyObject, IsString } from 'class-validator'
import { PublicUser } from 'src/user/user.entity'

export class Profile {
  @IsString()
  @IsNotEmpty()
  firstName: string

  @IsString()
  @IsNotEmpty()
  lastName: string

  @IsString()
  bio: string

  @IsNotEmptyObject()
  user: PublicUser
}
