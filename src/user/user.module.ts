import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

import { UserService } from './user.service'
import { UserController } from './user.controller'
import { PublicUserService } from './public/public-user.service'

@Module({
  providers: [UserService, PublicUserService, PrismaService],
  controllers: [UserController],
})
export class UserModule {}
