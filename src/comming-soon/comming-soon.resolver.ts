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
import { CreateCommingSoonDto } from './dto/create-commin-soon.dto';
import { UpdateCommingSoonDto } from './dto/update-commin-soon.dto';
import { CommingSoon } from './models/comming-soon.model';

@InputType()
class CommingSoonUniqueInput {
  @IsInt()
  @Field((type) => Int)
  id: number;
}

@Resolver(CommingSoon)
export class CommingSoonResolver {
  constructor(private readonly prisma: PrismaService) {}

  @ResolveField()
  async image(@Root() commingSoon: CommingSoon) {
    return this.prisma.commingSoon
      .findUnique({
        where: { id: commingSoon.id },
      })
      .image();
  }

  @UseGuards(RoleGuard(Role.ADMIN, Role.EDITOR))
  @Query((returns) => [CommingSoon], { nullable: true })
  async commingSoonList() {
    return await this.prisma.commingSoon.findMany();
  }

  @UseGuards(RoleGuard(Role.ADMIN, Role.EDITOR))
  @Query((returns) => CommingSoon, { nullable: true })
  async commingSoon(
    @Args('where', { type: () => CommingSoonUniqueInput })
    commingSoonUniqueInput: CommingSoonUniqueInput,
  ) {
    return await this.prisma.commingSoon.findUnique({
      where: commingSoonUniqueInput,
    });
  }

  @UseGuards(RoleGuard(Role.ADMIN, Role.EDITOR))
  @Mutation((returns) => CommingSoon)
  async createCommingSoon(
    @Args('data', { type: () => UpdateCommingSoonDto })
    updateCommingSoonDto: CreateCommingSoonDto,
  ) {
    try {
      return await this.prisma.commingSoon.create({
        data: updateCommingSoonDto,
      });
    } catch (e) {
      handlePrismaError(e, 'Comming Soon');
    }
  }

  @UseGuards(RoleGuard(Role.ADMIN, Role.EDITOR))
  @Mutation((returns) => CommingSoon)
  async updateCommingSoon(
    @Args('where', { type: () => CommingSoonUniqueInput })
    commingSoonUniqueInput: CommingSoonUniqueInput,
    @Args('data', { type: () => UpdateCommingSoonDto })
    updateCommingSoonDto: UpdateCommingSoonDto,
  ) {
    try {
      return await this.prisma.commingSoon.update({
        where: commingSoonUniqueInput,
        data: updateCommingSoonDto,
      });
    } catch (e) {
      handlePrismaError(e, 'Comming Soon');
    }
  }

  @UseGuards(RoleGuard(Role.ADMIN, Role.EDITOR))
  @Mutation((returns) => CommingSoon)
  async deleteCommingSoon(
    @Args('where', { type: () => CommingSoonUniqueInput })
    commingSoonUniqueInput: CommingSoonUniqueInput,
  ) {
    try {
      return await this.prisma.commingSoon.delete({
        where: commingSoonUniqueInput,
      });
    } catch (e) {
      handlePrismaError(e, 'Comming Soon');
    }
  }
}
