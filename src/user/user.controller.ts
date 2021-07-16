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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { RegisterDto } from './dto/register.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserId } from './user.decorator'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUser(@UserId() id: number) {
    return this.userService.getPubicUser(id)
  }

  @Post()
  async register(@Body() body: RegisterDto) {
    return this.userService.createPublicUser(body)
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async update(@UserId() id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updatePublicUser(id, updateUserDto)
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async delete(@UserId() id: number) {
    return this.userService.deleteUser(id)
  }
}
