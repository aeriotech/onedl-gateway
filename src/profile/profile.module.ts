import { Module } from '@nestjs/common'
import { ProfileService } from './profile.service'
import { ProfileController } from './profile.controller'
import { PrismaModule } from 'src/prisma/prisma.module'
import { PrismaService } from 'src/prisma/prisma.service'
import { UserService } from 'src/user/user.service'

@Module({
  providers: [ProfileService, PrismaService, UserService],
  controllers: [ProfileController],
})
export class ProfileModule {}
