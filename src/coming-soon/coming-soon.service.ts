import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ComingSoonService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.comingSoon.findMany({
      include: {
        image: {
          select: {
            url: true,
          },
        },
      },
    });
  }
}
