import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoleGuard } from 'src/role/role.guard';
import { PublicFile } from './models/public-file.model';

@Resolver()
export class FilesResolver {
  constructor(private readonly prisma: PrismaService) {}

  @UseGuards(RoleGuard(Role.ADMIN, Role.EDITOR))
  @Query((returns) => [PublicFile], { nullable: true })
  async files() {
    return await this.prisma.publicFile.findMany();
  }
}
