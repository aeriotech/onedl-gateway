import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { UserId } from 'src/user/user.decorator'
import { ProfileService } from './profile.service'

type UpdateProfileDto = Prisma.ProfileUpsertWithoutUserInput

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getProfile(@UserId() id: number) {
    return await this.profileService.find({ id })
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateProfile(
    @UserId() id: number,
    @Body() data: Prisma.ProfileUpdateInput,
  ) {
    return await this.profileService.update({ id }, data)
  }
}
