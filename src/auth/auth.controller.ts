import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthGuard } from '@nestjs/passport'

@Controller('auth')
export class AuthController {

  constructor(private auth: AuthService) {
  }

  @Post('/')
  @UseGuards(AuthGuard('local'))
  async authenticate(@Request() req) {
    return req.user
  }

}
