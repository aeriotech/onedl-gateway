import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { UserId } from 'src/user/user.decorator'
import { ProfileUpdateDto } from './dto/profile-update.dto'
import { ProfileService } from './profile.service'

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getProfile(@UserId() id: number) {
    return await this.profileService.getPublicProfile(id)
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateProfile(
    @UserId() id: number,
    @Body() profileUpdateDto: ProfileUpdateDto,
  ) {
    return await this.profileService.updatePublicProfile(id, profileUpdateDto)
  }
}
