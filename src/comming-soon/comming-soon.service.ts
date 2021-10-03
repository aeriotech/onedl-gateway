import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommingSoonService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.commingSoon.findMany({
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
