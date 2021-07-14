import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Prisma, User } from '@prisma/client'
import { RegisterDto } from './dto/register.dto'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async findByUsernameOrEmail(usernameOrEmail: string): Promise<User | null> {
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

  async find(user: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: user,
    })
  }

  async register(registerDto: RegisterDto) {
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(registerDto.password, salt)
    const { id, password, profileId, ...result } = await this.create({
      username: registerDto.username,
      email: registerDto.email,
      password: hashedPassword,
      profile: {
        create: {},
      },
    })

    return result
  }

  async create(data: Prisma.UserCreateInput): Promise<User | null> {
    const { username, email } = data
    if (await this.find({ username })) {
      throw new ConflictException('User with this username exists')
    }

    if (await this.find({ email })) {
      throw new ConflictException('User with this email exists')
    }

    return this.prismaService.user.create({
      data,
    })
  }

  async update(
    user: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
  ) {
    const salt = await bcrypt.genSalt()
    let hashedPassword
    if (data.password) {
      hashedPassword = await bcrypt.hash(data.password.toString(), salt)
    }
    const result = await this.prismaService.user.update({
      where: user,
      data: {
        ...data,
        password: hashedPassword,
      },
      select: {
        username: true,
        email: true,
      },
    })

    return result
  }

  async delete(data: Prisma.UserWhereUniqueInput) {
    if (await this.find(data)) {
      return this.prismaService.user.delete({
        where: data,
        select: {
          username: true,
          email: true,
        },
      })
    }
    throw new NotFoundException('This user does not exist')
  }
}
