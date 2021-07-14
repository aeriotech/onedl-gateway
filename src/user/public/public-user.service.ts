import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class PublicUserService {
  private select: Prisma.UserSelect = {
    username: true,
    email: true,
  }

  constructor(private readonly prismaService: PrismaService) {}

  async findFirst(where: Prisma.UserWhereInput) {
    return this.prismaService.user.findFirst({
      where,
      select: this.select,
    })
  }
}
