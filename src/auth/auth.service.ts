import { Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { UserService } from '../user/user.service'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { AuthLoginDto } from './dto/auth-login.dto'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(AuthService.name)

  async validateUser(authLoginDto: AuthLoginDto) {
    const { username, password } = authLoginDto
    const user = await this.userService.findOne(username)
    if (user) {
      const valid = await bcrypt.compare(password, user.password)
      if (valid) {
        const { password, ...result } = user
        return result
      }
    }
    throw new UnauthorizedException()
  }

  async login(authLoginDto: AuthLoginDto) {
    const user = await this.validateUser(authLoginDto)

    const payload = {
      userId: user.id,
    }

    return {
      access_token: this.jwtService.sign(payload),
    }
  }
}
