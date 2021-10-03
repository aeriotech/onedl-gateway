import { Module } from '@nestjs/common';
import { ComingSoonService } from './coming-soon.service';
import { ComingSoonController } from './coming-soon.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ComingSoonResolver } from './coming-soon.resolver';

@Module({
  controllers: [ComingSoonController],
  providers: [ComingSoonService, PrismaService, ComingSoonResolver],
})
export class ComingSoonModule {}
