import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { validate } from 'class-validator'
import { PrismaService } from 'src/prisma/prisma.service'
import { UserService } from 'src/user/user.service'
import { ProfileUpdateDto } from './dto/profile-update.dto'

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  private public: Prisma.ProfileSelect = {
    firstName: true,
    lastName: true,
    bio: true,
    createdAt: true,
    updatedAt: true,
  }

  async getPublicProfile(id: number) {
    return this.prisma.profile.findUnique({
      where: { id },
      select: this.public,
    })
  }

  async updatePublicProfile(id: number, profileUpdateDto: ProfileUpdateDto) {
    const { profileId } = await this.userService.getUser({ id })
    return this.prisma.profile.update({
      where: { id: profileId },
      data: profileUpdateDto,
      select: this.public,
    })
  }
}
