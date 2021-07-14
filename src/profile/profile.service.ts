import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { UserService } from 'src/user/user.service'

@Injectable()
export class ProfileService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
  ) {}

  async find(user: Prisma.UserWhereUniqueInput) {
    const profile = await this.prismaService.profile.findFirst({
      where: {
        user,
      },
      select: {
        bio: true,
        updatedAt: true,
      },
    })
    return profile
  }

  async update(
    user: Prisma.UserWhereUniqueInput,
    data: Prisma.ProfileUpdateInput,
  ) {
    const { profileId } = await this.userService.find(user)
    return this.prismaService.profile.update({
      where: {
        id: profileId,
      },
      data,
      select: {
        bio: true,
        updatedAt: true,
      },
    })
  }
}
