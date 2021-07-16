import { Module } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';

@Module({
  providers: [ShopService],
  controllers: [ShopController]
})
export class ShopModule {}
