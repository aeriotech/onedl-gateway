import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostResolver } from './post.resolver';

@Module({
  controllers: [PostController],
  providers: [PostService, PrismaService, PostResolver],
})
export class PostModule {}
