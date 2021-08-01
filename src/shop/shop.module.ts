import { Module } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilesService } from 'src/files/files.service';

@Module({
  providers: [ShopService, PrismaService, FilesService],
  controllers: [ShopController],
})
export class ShopModule {}
