import { Module } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { DiscountController } from './discount.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ShopService } from 'src/shop/shop.service';
import { FilesService } from 'src/files/files.service';

@Module({
  providers: [DiscountService, PrismaService, ShopService, FilesService],
  controllers: [DiscountController],
})
export class DiscountModule {}
