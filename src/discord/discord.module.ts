import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { DiscordService } from './discord.service';

@Module({
  imports: [forwardRef(() => UserModule)],
  providers: [DiscordService],
  exports: [DiscordService],
})
export class DiscordModule {}
