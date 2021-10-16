import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilesService } from 'src/files/files.service';
import { Module } from '@nestjs/common';
import { ShopResolver } from './shop.resolver';

@Module({
  providers: [ShopService, PrismaService, FilesService, ShopResolver],
  controllers: [ShopController],
})
export class ShopModule {}
