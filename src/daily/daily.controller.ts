import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PublicCategory } from 'src/category/models/public-category.model';
import { PublicCoupon } from 'src/coupon/models/public-coupon.model';
import { UserId } from 'src/user/user.decorator';
import { PublicFilter } from 'src/utils/filter.interceptor';
import { DailyService } from './daily.service';
import { DailyDiscountMap } from './models/daily-discount.model';
import { PublicDaily } from './models/public-daily.model';

@ApiTags('Daily')
@Controller('daily')
export class DailyController {
  constructor(private readonly dailyService: DailyService) {}

  @ApiBearerAuth('User')
  @UseInterceptors(PublicFilter(PublicDaily))
  @Get()
  async getDailyList() {
    return this.dailyService.getAllPublic();
  }

  @ApiBearerAuth('User')
  @UseInterceptors(PublicFilter(PublicDaily))
  @Get('/:uuid')
  async getDaily(@Param('uuid') dailyUuid: string) {
    return this.dailyService.getPublic(dailyUuid);
  }

  @ApiBearerAuth('User')
  @UseInterceptors(PublicFilter(PublicCategory))
  @Get('/:uuid/categories')
  async getDailyCategories(@Param('uuid') dailyUuid: string) {
    return this.dailyService.getCategories(dailyUuid);
  }

  @ApiBearerAuth('User')
  @Get('/:uuid/available')
  async getAvailable(
    @UserId() userId: number,
    @Param('uuid') dailyUuid: string,
  ) {
    return this.dailyService.isAvailable(userId, dailyUuid);
  }

  @ApiBearerAuth('User')
  @UseInterceptors(PublicFilter(DailyDiscountMap))
  @Post(':uuid')
  async claimDaily(@UserId() userId: number, @Param('uuid') dailyUuid: string) {
    return this.dailyService.claimDailyDiscount(userId, dailyUuid);
  }

  /**
   * Checks if daily discount is available
   */
  // @UseGuards(JwtAuthGuard)
  // @Get('available')
  // available(@UserId() userId: number) {
  //   return this.dailyService.checkAvailability(userId);
  // }

  /**
   * Returns the list of shops
   */
  // @UseGuards(JwtAuthGuard)
  // @Get('start')
  // start(@UserId() userId: number) {
  //   return this.dailyService.start(userId);
  // }

  /**
   * Stores the selected discount, returns it and ends the session
   */
  // @UseGuards(JwtAuthGuard)
  // @Post('select/:index')
  // select(@UserId() userId: number, @Param('index') selected: number) {
  //   return this.dailyService.select(userId, selected);
  // }
}
