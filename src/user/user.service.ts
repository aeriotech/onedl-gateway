import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { RegisterDto } from './dto/register.dto';
import { UpdatePublicUserDto } from './dto/update-public-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailConfirmationService } from 'src/email-confirmation/email-confirmation.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  async getPublicUser(select: Prisma.UserWhereUniqueInput) {
    await this.checkUser(select);
    const user = await this.prisma.user.findUnique({
      where: select,
    });
    return user;
  }

  async updatePublicUser(id: number, updateUserDto: UpdatePublicUserDto) {
    let hashedPassword;
    if (updateUserDto.password) {
      hashedPassword = await this.hashPassword(
        updateUserDto.password.toString(),
      );
    }

    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: {
          ...updateUserDto,
          password: hashedPassword,
        },
      });
      return user;
    } catch (e) {
      this.handleException(e);
    }
  }

  async createPublicUser({
    username,
    email,
    password,
    firstName,
    lastName,
  }: RegisterDto) {
    const hashedPassword = await this.hashPassword(password);

    try {
      const user = await this.prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          profile: {
            create: {
              firstName,
              lastName,
            },
          },
        },
      });

      this.emailConfirmationService.sendConfirmationEmail(user);

      return user;
    } catch (e) {
      this.handleException(e);
    }
  }

  async findByUsernameOrEmail(usernameOrEmail: string) {
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
    });
  }

  async getUser(user: Prisma.UserWhereUniqueInput) {
    await this.checkUser(user);
    const { password, ...result } = await this.prisma.user.findUnique({
      where: user,
      include: {
        profile: {
          include: {
            profilePicture: true,
          },
        },
      },
    });
    return result;
  }

  async getUsers() {
    return await (
      await this.prisma.user.findMany()
    ).map((user) => {
      const { password, ...result } = user;
      return result;
    });
  }

  async updateUser(
    user: Prisma.UserWhereUniqueInput,
    updateUserDto: UpdateUserDto,
  ) {
    await this.checkUser(user);
    let hashedPassword;
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      hashedPassword = await bcrypt.hash(updateUserDto.password, salt);
    }
    const { password, ...result } = await this.prisma.user.update({
      where: user,
      data: {
        ...updateUserDto,
        password: hashedPassword,
      },
    });
    return result;
  }

  async deleteUser(id: number) {
    await this.checkUser({ id });
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async checkUser(user: Prisma.UserWhereUniqueInput) {
    if (!(await this.prisma.user.findUnique({ where: user }))) {
      throw new NotFoundException('This user does not exist');
    }
  }

  async hashPassword(password: string) {
    return bcrypt.hash(password, await bcrypt.genSalt());
  }

  private handleException(error: Error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          const conflictingField = error.meta['target'][0];
          throw new ConflictException(
            `User with this ${conflictingField} already exists`,
          );
        default:
          throw new BadRequestException(error.code);
      }
      throw error;
    }
  }
}
