import { Module } from '@nestjs/common';
import { DailyService } from './daily.service';
import { DailyController } from './daily.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { ShopService } from 'src/shop/shop.service';
import { FilesService } from 'src/files/files.service';

@Module({
  providers: [
    DailyService,
    PrismaService,
    UserService,
    ShopService,
    FilesService,
  ],
  controllers: [DailyController],
})
export class DailyModule {}
