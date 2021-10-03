import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { FilesResolver } from './files.resolver';

@Module({
  providers: [FilesService, PrismaService, FilesResolver],
  exports: [FilesService, PrismaService],
  controllers: [FilesController],
})
export class FilesModule {}
