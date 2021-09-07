import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProfileModule } from './profile/profile.module';
import { DiscountModule } from './discount/discount.module';
import { ShopModule } from './shop/shop.module';
import { CouponModule } from './coupon/coupon.module';
import { FilesModule } from './files/files.module';
import { RoleModule } from './role/role.module';
import { DailyModule } from './daily/daily.module';
import { MailModule } from './mail/mail.module';
import { CardValidatorModule } from './card-validator/card-validator.module';
import { PlanModule } from './plan/plan.module';
import { EmailConfirmationModule } from './email-confirmation/email-confirmation.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ProfileModule,
    DiscountModule,
    ShopModule,
    CouponModule,
    FilesModule,
    RoleModule,
    DailyModule,
    MailModule,
    CardValidatorModule,
    PlanModule,
    EmailConfirmationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
