import { Injectable } from '@nestjs/common'
import { UserService } from '../user/user.service'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {

  constructor(private users: UserService) {
  }

  async validateUser(username: string, password: string) {
    const user = await this.users.findOne(username)
    if (user) {
      const valid = await bcrypt.compare(password, user.password)
      if (valid) {
        const { id, password, ...result } = user
        return result
      }
    }
    return null
  }

}
