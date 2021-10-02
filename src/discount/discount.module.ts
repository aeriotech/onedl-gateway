import { Module } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { DiscountController } from './discount.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ShopService } from 'src/shop/shop.service';
import { FilesService } from 'src/files/files.service';
import { FilesModule } from 'src/files/files.module';
import { ShopModule } from 'src/shop/shop.module';
import { CouponModule } from 'src/coupon/coupon.module';
import { DiscountResolver } from './discount.resolver';

@Module({
  imports: [FilesModule, ShopModule, CouponModule],
  providers: [DiscountService, PrismaService, ShopService, FilesService, DiscountResolver],
  controllers: [DiscountController],
  exports: [DiscountService],
})
export class DiscountModule {}
