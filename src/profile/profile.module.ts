import { Module } from '@nestjs/common'
import { ProfileService } from './profile.service'
import { ProfileController } from './profile.controller'
import { PrismaService } from 'src/prisma/prisma.service'
import { UserService } from 'src/user/user.service'
import { FilesService } from 'src/files/files.service'

@Module({
  providers: [ProfileService, PrismaService, FilesService, UserService],
  controllers: [ProfileController],
})
export class ProfileModule {}
