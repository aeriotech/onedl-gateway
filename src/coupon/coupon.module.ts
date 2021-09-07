import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { DiscountService } from 'src/discount/discount.service';
import { ShopService } from 'src/shop/shop.service';
import { FilesService } from 'src/files/files.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  providers: [
    CouponService,
    PrismaService,
    DiscountService,
    ShopService,
    FilesService,
  ],
  controllers: [CouponController],
})
export class CouponModule {}
