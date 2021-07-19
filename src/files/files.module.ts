import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { FilesService } from './files.service'

@Module({
  providers: [FilesService, PrismaService],
})
export class FilesModule {}
