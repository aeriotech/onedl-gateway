import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Prisma, User } from '@prisma/client'
import { RegisterDto } from './dto/register.dto'
import * as bcrypt from 'bcrypt'
import { UpdateUserDto } from './dto/update-user.dto'
import { AuthService } from 'src/auth/auth.service'
import { validate } from 'class-validator'
import { PublicUser } from './user.entity'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  private public: Prisma.UserSelect = {
    username: true,
    email: true,
    createdAt: true,
    updatedAt: true,
  }

  async getPubicUser(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: this.public,
    })
  }

  async updatePublicUser(id: number, updateUserDto: UpdateUserDto) {
    const usernameUser = await this.getUser({
      username: updateUserDto.username,
    })
    if (usernameUser && usernameUser.id != id) {
      throw new ConflictException('User with this username already exists')
    }

    const emailUser = await this.getUser({
      email: updateUserDto.email,
    })
    if (emailUser && emailUser.id != id) {
      throw new ConflictException('User with this email already exists')
    }

    let hashedPassword
    if (updateUserDto.password) {
      hashedPassword = await bcrypt.hash(
        updateUserDto.password.toString(),
        await bcrypt.genSalt(),
      )
    }

    return await this.prisma.user.update({
      where: { id },
      data: {
        ...updateUserDto,
        password: hashedPassword,
      },
      select: this.public,
    })
  }

  async createPublicUser(registerDto: RegisterDto) {
    if (await this.getUser({ username: registerDto.username })) {
      throw new ConflictException('User with this username already exists')
    }

    if (await this.getUser({ email: registerDto.email })) {
      throw new ConflictException('User with this email already exists')
    }

    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(registerDto.password, salt)

    return this.prisma.user.create({
      data: {
        username: registerDto.username,
        email: registerDto.email,
        password: hashedPassword,
        profile: {
          create: {
            firstName: registerDto.firstName,
            lastName: registerDto.lastName,
          },
        },
      },
      select: this.public,
    })
  }

  async findByUsernameOrEmail(usernameOrEmail: string): Promise<User | null> {
    return this.prisma.user.findFirst({
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

  async getUser(user: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: user,
    })
  }

  async deleteUser(id: number) {
    if (await this.getUser({ id })) {
      this.prisma.user.delete({
        where: { id },
        select: this.public,
      })
    }
    throw new NotFoundException('This user does not exist')
  }
}
