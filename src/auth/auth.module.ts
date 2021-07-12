import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { LocalStrategy } from './local.strategy'

@Module({
  providers: [AuthService, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {
}
