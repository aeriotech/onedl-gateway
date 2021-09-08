import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserId } from 'src/user/user.decorator';
import { DailyService } from './daily.service';

@ApiTags('Daily')
@Controller('daily')
export class DailyController {
  constructor(private readonly dailyService: DailyService) {}

  /**
   * Checks if daily discount is available
   */
  @UseGuards(JwtAuthGuard)
  @Get('available')
  available(@UserId() userId: number) {
    return this.dailyService.checkAvailability(userId);
  }

  /**
   * Returns the list of shops
   */
  @UseGuards(JwtAuthGuard)
  @Get('start')
  start(@UserId() userId: number) {
    return this.dailyService.start(userId);
  }

  /**
   * Stores the selected discount, returns it and ends the session
   */
  @UseGuards(JwtAuthGuard)
  @Post('select/:index')
  select(@UserId() userId: number, @Param('index') selected: number) {
    return this.dailyService.select(userId, selected);
  }
}
