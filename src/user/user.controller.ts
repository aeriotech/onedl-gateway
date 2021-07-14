import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { PublicUserService } from './public/public-user.service'
import { UserId } from './user.decorator'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly publicUserService: PublicUserService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUser(@UserId() id: number) {
    return this.publicUserService.findFirst({ id })
  }

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
  async update(
    @UserId() id: number,
    @Body() updateUserDto: Prisma.UserUpdateInput,
  ) {
    return this.userService.update({ id }, updateUserDto)
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async delete(@UserId() id: number) {
    return this.userService.delete({ id })
  }
}
