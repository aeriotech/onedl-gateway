import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/public.decorator';
import { PublicFilter } from 'src/utils/filter.interceptor';
import { CommingSoonService } from './comming-soon.service';
import { PublicComminSoon } from './models/public-commin-soon.model';

@ApiTags('Commin Soon Endpoints')
@Controller('comming-soon')
export class CommingSoonController {
  constructor(private readonly commingSoonService: CommingSoonService) {}

  @Get()
  @UseInterceptors(PublicFilter(PublicComminSoon))
  @Public()
  findAll() {
    return this.commingSoonService.findAll();
  }
}
