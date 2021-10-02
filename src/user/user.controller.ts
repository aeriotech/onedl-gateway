import {
  Body,
  Controller,
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
import { Public } from 'src/auth/public.decorator';
import { RoleGuard } from 'src/role/role.guard';
import { PublicFilter } from 'src/utils/filter.interceptor';
import { RegisterDto } from './dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PublicUser } from './models/public-user.model';
import { UserId } from './user.decorator';
import { UserService } from './user.service';

@ApiTags('Users Endpoint')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Creates a new user
   * @param body User data
   * @returns The newly created user
   */
  @Post()
  @Public()
  @UseInterceptors(PublicFilter(PublicUser))
  register(@Body() body: RegisterDto) {
    return this.userService.createPublic(body);
  }

  /**
   * Return the currently authenticated user
   * @param id Id of the user to find
   * @returns The user
   */
  @ApiBearerAuth('User')
  @UseInterceptors(PublicFilter(PublicUser))
  @Get('me')
  getPublicUser(@UserId() id: number) {
    return this.userService.findPublic({ id });
  }

  /**
   * Updates the user with the given id
   * @param username Username of the user
   * @param updateUserDto Fields to update
   * @returns Updaed user
   */
  @ApiBearerAuth('User')
  @UseGuards(JwtAuthGuard, RoleGuard(Role.ADMIN))
  @Put()
  updateUser(@UserId() id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updatePublic(+id, updateUserDto);
  }
}
