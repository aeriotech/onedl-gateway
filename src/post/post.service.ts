import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  findAllPublic() {
    return this.prisma.post.findMany({
      where: { public: true },
      include: {
        image: {
          select: {
            url: true,
          },
        },
      },
    });
  }

  findOnePublic(id: number) {
    return this.prisma.post.findFirst({
      where: {
        id,
        public: true,
      },
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
