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
import { Role } from '@prisma/client';
import { IsInt } from 'class-validator';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoleGuard } from 'src/role/role.guard';
import handlePrismaError from 'src/utils/prisma-error-handler';
import { CreateComingSoonDto } from './dto/create-commin-soon.dto';
import { UpdateComingSoonDto } from './dto/update-commin-soon.dto';
import { ComingSoon } from './models/coming-soon.model';

@InputType()
class ComingSoonUniqueInput {
  @IsInt()
  @Field((type) => Int)
  id: number;
}

@Resolver(ComingSoon)
export class ComingSoonResolver {
  constructor(private readonly prisma: PrismaService) {}

  @ResolveField()
  async image(@Root() comingSoon: ComingSoon) {
    return this.prisma.comingSoon
      .findUnique({
        where: { id: comingSoon.id },
      })
      .image();
  }

  @UseGuards(RoleGuard(Role.ADMIN, Role.EDITOR))
  @Query((returns) => [ComingSoon], { nullable: true })
  async comingSoonList() {
    return await this.prisma.comingSoon.findMany();
  }

  @UseGuards(RoleGuard(Role.ADMIN, Role.EDITOR))
  @Query((returns) => ComingSoon, { nullable: true })
  async comingSoon(
    @Args('where', { type: () => ComingSoonUniqueInput })
    comingSoonUniqueInput: ComingSoonUniqueInput,
  ) {
    return await this.prisma.comingSoon.findUnique({
      where: comingSoonUniqueInput,
    });
  }

  @UseGuards(RoleGuard(Role.ADMIN, Role.EDITOR))
  @Mutation((returns) => ComingSoon)
  async createCommingSoon(
    @Args('data', { type: () => UpdateComingSoonDto })
    updateCommingSoonDto: CreateComingSoonDto,
  ) {
    try {
      return await this.prisma.comingSoon.create({
        data: updateCommingSoonDto,
      });
    } catch (e) {
      handlePrismaError(e, 'Comming Soon');
    }
  }

  @UseGuards(RoleGuard(Role.ADMIN, Role.EDITOR))
  @Mutation((returns) => ComingSoon)
  async updateComingSoon(
    @Args('where', { type: () => ComingSoonUniqueInput })
    comingSoonUniqueInput: ComingSoonUniqueInput,
    @Args('data', { type: () => UpdateComingSoonDto })
    updateComingSoonDto: UpdateComingSoonDto,
  ) {
    try {
      return await this.prisma.comingSoon.update({
        where: comingSoonUniqueInput,
        data: updateComingSoonDto,
      });
    } catch (e) {
      handlePrismaError(e, 'Coming Soon');
    }
  }

  @UseGuards(RoleGuard(Role.ADMIN, Role.EDITOR))
  @Mutation((returns) => ComingSoon)
  async deleteComingSoon(
    @Args('where', { type: () => ComingSoonUniqueInput })
    comingSoonUniqueInput: ComingSoonUniqueInput,
  ) {
    try {
      return await this.prisma.comingSoon.delete({
        where: comingSoonUniqueInput,
      });
    } catch (e) {
      handlePrismaError(e, 'Coming Soon');
    }
  }
}
