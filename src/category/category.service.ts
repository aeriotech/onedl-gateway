import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { PublicDiscount } from 'src/discount/models/public-discount.model';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async getCategoriesWithDiscounts() {
    const categories = await this.prisma.category.findMany({
      where: {
        display: true,
      },
      include: {
        discountsMulti: {
          include: {
            thumbnail: {
              select: {
                url: true,
              },
            },
          },
        },
      },
    });

    return categories.map((category) => ({
      ...category,
      discounts: plainToClass(PublicDiscount, category.discountsMulti),
    }));
  }
}
