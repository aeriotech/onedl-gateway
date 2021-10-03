import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/public.decorator';
import { PublicFilter } from 'src/utils/filter.interceptor';
import { ComingSoonService } from './coming-soon.service';
import { PublicComminSoon } from './models/public-coming-soon.model';

@ApiTags('Coming Soon Endpoints')
@Controller('coming-soon')
export class ComingSoonController {
  constructor(private readonly comingSoonService: ComingSoonService) {}

  @Get()
  @UseInterceptors(PublicFilter(PublicComminSoon))
  @Public()
  findAll() {
    return this.comingSoonService.findAll();
  }
}
