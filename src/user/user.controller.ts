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
import { Role } from '@prisma/client'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { RoleGuard } from 'src/role/role.guard'
import { RegisterDto } from './dto/register.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserId } from './user.decorator'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Finds a user with id
   * @param id Id of the user to find
   * @returns The user
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getPublicUser(@UserId() id: number) {
    return this.userService.getPubicUser({ id })
  }

  @UseGuards(JwtAuthGuard, RoleGuard(Role.ADMIN))
  @Get(':username')
  async getUser(@Param('username') username: string) {
    return this.userService.getUser({ username })
  }

  @UseGuards(JwtAuthGuard, RoleGuard(Role.ADMIN))
  @Get()
  async getUsers() {
    return this.userService.getUsers()
  }

  /**
   *
   * @param username Username of the user
   * @param updateUserDto Fields to update
   * @returns Updaed user
   */
  @UseGuards(JwtAuthGuard, RoleGuard(Role.ADMIN))
  @Put(':username')
  async updateUser(
    @Param('username') username: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser({ username }, updateUserDto)
  }

  /**
   * Creates a new user
   * @param body User data
   * @returns The newly created user
   */
  @Post()
  async register(@Body() body: RegisterDto) {
    return this.userService.createPublicUser(body)
  }

  /**
   * Updates user with id
   * @param id Id of the user to update
   * @param updateUserDto Fields to update
   * @returns Updated user
   */
  @UseGuards(JwtAuthGuard)
  @Put()
  async update(@UserId() id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updatePublicUser(id, updateUserDto)
  }

  /**
   * Deletes user with id
   * @param id Id of user to delete
   * @returns Deleted user
   */
  @UseGuards(JwtAuthGuard)
  @Delete()
  async delete(@UserId() id: number) {
    return this.userService.deleteUser(id)
  }
}
