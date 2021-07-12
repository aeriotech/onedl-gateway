import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Prisma, User } from '@prisma/client'
import { RegisterDto } from './dto/register.dto'
import * as bcrypt from 'bcrypt'
import { UpdateUserDto } from './dto/user-update.dto'

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

  private async find(user: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: user,
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
    const { username, email } = data
    if (await this.find({ username })) {
      throw new ConflictException('User with this username exists')
    }

    if (await this.find({ email })) {
      throw new ConflictException('User with this email exsists')
    }

    return this.prismaService.user.create({
      data,
    })
  }

  async update(
    user: Prisma.UserWhereUniqueInput,
    updateUserDto: UpdateUserDto,
  ) {
    const salt = await bcrypt.genSalt()
    let hashedPassword
    if (updateUserDto.password) {
      hashedPassword = await bcrypt.hash(updateUserDto.password, salt)
    }
    const { id, password, ...result } = await this.prismaService.user.update({
      where: user,
      data: {
        email: updateUserDto.email,
        password: hashedPassword,
      },
    })

    return result
  }

  async delete(data: Prisma.UserWhereUniqueInput) {
    if (await this.find(data)) {
      return this.prismaService.user.delete({
        where: data,
      })
    }
    throw new NotFoundException('This user does not exist')
  }
}
