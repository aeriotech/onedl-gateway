import { UseGuards } from '@nestjs/common';
import {
  Args,
  Field,
  InputType,
  Int,
  Query,
  ResolveField,
  Resolver,
  Root,
} from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoleGuard } from 'src/role/role.guard';
import { Profile } from './models/profile.model';

@InputType()
class ProfileUniqueInput {
  @Field((type) => Int)
  id: number;
}

@Resolver(Profile)
export class ProfileResolver {
  constructor(private readonly prisma: PrismaService) {}

  @ResolveField()
  async user(@Root() profile: Profile) {
    return this.prisma.profile
      .findUnique({
        where: { id: profile.id },
      })
      .user();
  }

  @ResolveField()
  async profilePicture(@Root() profile: Profile) {
    return this.prisma.profile
      .findUnique({
        where: { id: profile.id },
      })
      .profilePicture();
  }

  @UseGuards(RoleGuard(Role.ADMIN))
  @Query((returns) => [Profile], { nullable: true })
  async profiles() {
    return this.prisma.profile.findMany();
  }

  @UseGuards(RoleGuard(Role.ADMIN))
  @Query((returns) => Profile, { nullable: true })
  async profile(
    @Args('where', { type: () => ProfileUniqueInput })
    profileUniqueInput: ProfileUniqueInput,
  ) {
    return this.prisma.profile.findUnique({
      where: profileUniqueInput,
    });
  }
}
