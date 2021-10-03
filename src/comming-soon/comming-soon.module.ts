import { Module } from '@nestjs/common';
import { CommingSoonService } from './comming-soon.service';
import { CommingSoonController } from './comming-soon.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommingSoonResolver } from './comming-soon.resolver';

@Module({
  controllers: [CommingSoonController],
  providers: [CommingSoonService, PrismaService, CommingSoonResolver],
})
export class CommingSoonModule {}
