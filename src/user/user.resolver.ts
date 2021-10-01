import { NotFoundException } from '@nestjs/common';
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
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './models/user.model';

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

@Resolver((of) => User)
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

  @Query((returns) => [User], { nullable: true })
  async users() {
    return this.prisma.user.findMany();
  }

  @Query((returns) => User, { nullable: true })
  async user(
    @Args('where', { type: () => UserUniqueInput })
    userUniqueInput: UserUniqueInput,
  ) {
    return this.prisma.user.findUnique({
      where: userUniqueInput,
    });
  }

  @Mutation((returns) => User)
  async updateUser(
    @Args('where', { type: () => UserUniqueInput })
    userUniqueInput: UserUniqueInput,
    @Args('data', { type: () => UpdateUserDto })
    updateUserDto: UpdateUserDto,
  ) {
    return this.prisma.user.update({
      where: userUniqueInput,
      data: updateUserDto,
    });
  }
}
