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
import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import { PostModule } from './post/post.module';
import { ComingSoonModule } from './coming-soon/coming-soon.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './tasks/tasks.service';
import { TasksModule } from './tasks/tasks.module';

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
    SlackModule,
    DiscordModule,
    AgeConfirmationModule,
    TasksModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: ({ req }) => ({ req }),
    }),
    PostModule,
    ComingSoonModule,
    TasksModule,
  ],
  providers: [
    StartupService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    TasksService,
  ],
})
export class AppModule {}
