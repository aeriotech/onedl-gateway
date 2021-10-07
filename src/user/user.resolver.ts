import { Role } from '.prisma/client';
import { UseGuards } from '@nestjs/common';
import {
  Args,
  Field,
  InputType,
  Int,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Root,
} from '@nestjs/graphql';
import { IsEmail, IsInt, IsString } from 'class-validator';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoleGuard } from 'src/role/role.guard';
import handlePrismaError from 'src/utils/prisma-error-handler';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './models/user.model';
import { UserId } from './user.decorator';

@InputType()
class UserUniqueInput {
  @IsInt()
  @Field((type) => Int, { nullable: true })
  id: number;

  @IsString()
  @Field({ nullable: true })
  username: string;

  @IsEmail()
  @Field({ nullable: true })
  email: string;
}

@Resolver(User)
export class UserResolver {
  constructor(private readonly prisma: PrismaService) {}

  @ResolveField()
  async profile(@Root() user: User) {
    return this.prisma.user
      .findUnique({
        where: { id: user.id },
      })
      .profile();
  }

  @ResolveField()
  async coupons(@Root() user: User) {
    return this.prisma.user
      .findUnique({
        where: { id: user.id },
      })
      .coupons();
  }

  @UseGuards(RoleGuard(Role.ADMIN))
  @Query((returns) => [User], { nullable: true })
  async users() {
    return await this.prisma.user.findMany();
  }

  @UseGuards(RoleGuard(Role.ADMIN))
  @Query((returns) => User, { nullable: true })
  async user(
    @Args('where', { type: () => UserUniqueInput })
    userUniqueInput: UserUniqueInput,
  ) {
    return await this.prisma.user.findUnique({
      where: userUniqueInput,
    });
  }

  @UseGuards(RoleGuard(Role.ADMIN, Role.EDITOR))
  @Query((returns) => User, { nullable: true })
  async me(@UserId() id: number) {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  @UseGuards(RoleGuard(Role.ADMIN))
  @Mutation((returns) => User)
  async updateUser(
    @Args('where', { type: () => UserUniqueInput })
    userUniqueInput: UserUniqueInput,
    @Args('data', { type: () => UpdateUserDto })
    updateUserDto: UpdateUserDto,
  ) {
    try {
      return await this.prisma.user.update({
        where: userUniqueInput,
        data: updateUserDto,
      });
    } catch (e) {
      handlePrismaError(e, 'User');
    }
  }

  @UseGuards(RoleGuard(Role.ADMIN))
  @Mutation((returns) => User)
  async deleteUser(
    @Args('where', { type: () => UserUniqueInput })
    userUniqueInput: UserUniqueInput,
  ) {
    try {
      return await this.prisma.user.delete({
        where: userUniqueInput,
      });
    } catch (e) {
      handlePrismaError(e, 'User');
    }
  }
}
