import { ConflictException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Prisma, User } from '@prisma/client'
import { RegisterDto } from './dto/register.dto'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async findOne(usernameOrEmail: string): Promise<User | null> {
    return this.prismaService.user.findFirst({
      where: {
        OR: [
          {
            username: usernameOrEmail,
          },
          {
            email: usernameOrEmail,
          },
        ],
      },
    })
  }

  private async findByUsername(username: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: {
        username,
      },
    })
  }

  private async findByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: {
        email,
      },
    })
  }

  async register(registerDto: RegisterDto) {
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(registerDto.password, salt)
    const { id, password, ...result } = await this.create({
      username: registerDto.username,
      email: registerDto.email,
      password: hashedPassword,
    })

    return result
  }

  async create(data: Prisma.UserCreateInput): Promise<User | null> {
    if (await this.findByUsername(data.username)) {
      throw new ConflictException('User with this username exists')
    }

    if (await this.findByEmail(data.email)) {
      throw new ConflictException('User with this email exsists')
    }

    return this.prismaService.user.create({
      data,
    })
  }

  async delete(data: Prisma.UserWhereUniqueInput) {
    return this.prismaService.user.delete({
      where: data,
    })
  }
}
