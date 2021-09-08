import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/role/role.guard';
import { PublicFilter } from 'src/utils/filter.interceptor';
import { RegisterDto } from './dto/register.dto';
import { UpdatePublicUserDto } from './dto/update-public-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PublicUser } from './models/public-user.model';
import { UserId } from './user.decorator';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Finds a user with id
   * @param id Id of the user to find
   * @returns The user
   */
  @ApiBearerAuth('User')
  @ApiBearerAuth('Admin')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(PublicFilter(PublicUser))
  @Get('me')
  getPublicUser(@UserId() id: number) {
    return this.userService.getPublicUser({ id });
  }

  @ApiBearerAuth('Admin')
  @UseGuards(JwtAuthGuard, RoleGuard(Role.ADMIN))
  @UseInterceptors(PublicFilter(PublicUser))
  @Get(':username')
  getUser(@Param('username') username: string) {
    return this.userService.getUser({ username });
  }

  @ApiBearerAuth('Admin')
  @UseGuards(JwtAuthGuard, RoleGuard(Role.ADMIN))
  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  /**
   *
   * @param username Username of the user
   * @param updateUserDto Fields to update
   * @returns Updaed user
   */
  @ApiBearerAuth('Admin')
  @UseGuards(JwtAuthGuard, RoleGuard(Role.ADMIN))
  @Put(':username')
  updateUser(
    @Param('username') username: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser({ username }, updateUserDto);
  }

  /**
   * Creates a new user
   * @param body User data
   * @returns The newly created user
   */
  @ApiBearerAuth('User')
  @Post()
  @UseInterceptors(PublicFilter(PublicUser))
  register(@Body() body: RegisterDto) {
    return this.userService.createPublicUser(body);
  }

  /**
   * Updates user with id
   * @param id Id of the user to update
   * @param updateUserDto Fields to update
   * @returns Updated user
   */
  @ApiBearerAuth('User')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(PublicFilter(PublicUser))
  @Put()
  update(@UserId() id: number, @Body() updateUserDto: UpdatePublicUserDto) {
    return this.userService.updatePublicUser(id, updateUserDto);
  }

  /**
   * Deletes user with id
   * @param id Id of user to delete
   * @returns Deleted user
   */
  @ApiBearerAuth('User')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(PublicFilter(PublicUser))
  @Delete()
  delete(@UserId() id: number) {
    return this.userService.deleteUser(id);
  }
}
