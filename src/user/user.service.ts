import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Prisma, User } from '@prisma/client'
import { RegisterDto } from './dto/register.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly logger = new Logger(UserService.name)

  private public: Prisma.UserSelect = {
    username: true,
    email: true,
    role: true,
    createdAt: true,
    updatedAt: true,
  }

  async getPubicUser(user: Prisma.UserWhereUniqueInput) {
    this.logger.log(`[Public] Get user ${JSON.stringify(user)}`)
    await this.checkUser(user)
    return this.prisma.user.findUnique({
      where: user,
      select: this.public,
    })
  }

  async updatePublicUser(id: number, updateUserDto: UpdateUserDto) {
    this.logger.log(`[Public] Updating user ${updateUserDto.username}`)
    let hashedPassword
    if (updateUserDto.password) {
      hashedPassword = await bcrypt.hash(
        updateUserDto.password.toString(),
        await bcrypt.genSalt(),
      )
    }

    try {
      return await this.prisma.user.update({
        where: { id },
        data: {
          ...updateUserDto,
          password: hashedPassword,
        },
        select: this.public,
      })
    } catch (e) {
      this.handleException(e)
    }
  }

  async createPublicUser(registerDto: RegisterDto) {
    this.logger.log(`[Public] Creating new user ${registerDto.username}`)
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(registerDto.password, salt)

    try {
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
    } catch (e) {
      this.handleException(e)
    }
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

  async getUser(user: Prisma.UserWhereUniqueInput) {
    this.logger.log(`Get user ${JSON.stringify(user)}`)
    await this.checkUser(user)
    const { password, ...result } = await this.prisma.user.findUnique({
      where: user,
      include: {
        profile: true,
      },
    })
    return result
  }

  async getUsers() {
    this.logger.log('Get users')
    return await (
      await this.prisma.user.findMany()
    ).map((user) => {
      const { password, ...result } = user
      return result
    })
  }

  async updateUser(
    user: Prisma.UserWhereUniqueInput,
    updateUserDto: UpdateUserDto,
  ) {
    this.logger.log(`Updating user ${updateUserDto.username}`)
    await this.checkUser(user)
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(updateUserDto.password, salt)
    return this.prisma.user.update({
      where: user,
      data: {
        ...updateUserDto,
        password: hashedPassword,
      },
    })
  }

  async deleteUser(id: number) {
    this.logger.log(`Deleting user with id ${id}`)
    await this.checkUser({ id })
    return this.prisma.user.delete({
      where: { id },
      select: this.public,
    })
  }

  async checkUser(user: Prisma.UserWhereUniqueInput) {
    if (!(await this.prisma.user.findUnique({ where: user }))) {
      throw new NotFoundException('This user does not exist')
    }
  }

  private handleException(error: Error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          const conflictingField = error.meta['target'][0]
          this.logger.warn(`User with this ${conflictingField} exists`)
          throw new ConflictException(
            `User with this ${conflictingField} already exists`,
          )
        default:
          throw new BadRequestException(error.code)
      }
    }
  }
}
