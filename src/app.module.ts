import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
import { StartupService } from './startup/startup.service';
import { ForgotPasswordModule } from './forgot-password/forgot-password.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { SlackModule } from './slack/slack.module';
import { DiscordModule } from './discord/discord.module';
import { AgeConfirmationModule } from './age-confirmation/age-confirmation.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
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
    ForgotPasswordModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SlackModule,
    DiscordModule,
    AgeConfirmationModule,
  ],
  providers: [
    StartupService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
