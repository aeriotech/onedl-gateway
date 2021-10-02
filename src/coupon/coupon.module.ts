import { forwardRef, Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ShopService } from 'src/shop/shop.service';
import { FilesService } from 'src/files/files.service';
import { UserModule } from 'src/user/user.module';
import { DiscountModule } from 'src/discount/discount.module';
import { CouponResolver } from './coupon.resolver';

@Module({
  imports: [UserModule, forwardRef(() => DiscountModule)],
  providers: [CouponService, PrismaService, ShopService, FilesService, CouponResolver],
  controllers: [CouponController],
  exports: [CouponService],
})
export class CouponModule {}
