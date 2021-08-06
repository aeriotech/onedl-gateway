import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { DiscountService } from 'src/discount/discount.service';

import { ShopService } from 'src/shop/shop.service';
import { FilesService } from 'src/files/files.service';
import { UserService } from 'src/user/user.service';

@Module({
  providers: [
    CouponService,
    PrismaService,
    DiscountService,
    ShopService,
    FilesService,
    UserService,
  ],
  controllers: [CouponController],
})
export class CouponModule {}
