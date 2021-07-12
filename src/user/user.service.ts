import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Prisma, User } from '@prisma/client'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {
  }

  async findOne(username: string): Promise<User | null> {
    return this.prisma.users.findUnique({
      where: {
        OR: [
          {
            username: username,
          },
          {
            email: username,
          },
        ],
      },
    })
  }

  async create(data: Prisma.UserCreateInput): Promise<User | null> {
    return this.prisma.users.create({
      data,
    })
  }

}