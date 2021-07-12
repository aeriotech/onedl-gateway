import { Body, Controller, Post, UseGuards, Get, Request } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthGuard } from '@nestjs/passport'
import { JwtAuthGuard } from './jwt-auth.guard'
import { LocalAuthGuard } from './local-auth.guard'
import { AuthLoginDto } from './dto/auth-login.dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  async login(@Body() authLoginDto: AuthLoginDto) {
    return this.authService.login(authLoginDto)
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async test() {
    return 'Success!'
  }
}
