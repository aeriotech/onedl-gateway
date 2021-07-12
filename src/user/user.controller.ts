import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { User } from '@prisma/client'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { UpdateUserDto } from './dto/user-update.dto'
import { UserId } from './user.decorator'
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

  @UseGuards(JwtAuthGuard)
  @Put()
  async update(@UserId() id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update({ id }, updateUserDto)
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async delete(@UserId() id: number) {
    return this.userService.delete({ id })
  }
}
