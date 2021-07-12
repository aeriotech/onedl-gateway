import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async register(
    @Body('username') username: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.userService.register({
      username,
      email,
      password,
    })
  }

  @Delete('/:username')
  @UseGuards(AuthGuard('local'))
  async delete(@Param('username') username: string) {
    return this.userService.delete({ username })
  }
}
