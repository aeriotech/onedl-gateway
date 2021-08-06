import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as dayjs from 'dayjs';
import { Discount, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { ShopService } from 'src/shop/shop.service';

@Injectable()
export class DiscountService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly shopService: ShopService,
  ) {}

  readonly public: Prisma.DiscountSelect = {
    name: true,
    parts: true,
    category: true,
    shop: {
      select: this.shopService.public,
    },
  };

  async createDiscount(data: CreateDiscountDto) {
    try {
      return await this.prisma.discount.create({ data });
    } catch (e) {
      this.handleException(e);
    }
  }

  async getDiscount(where: Prisma.DiscountWhereUniqueInput) {
    await this.checkDiscount(where);
    return this.prisma.discount.findUnique({
      where,
      include: {
        shop: true,
        category: true,
      },
    });
  }

  async getRandomDiscount(where: Prisma.DiscountWhereInput): Promise<Discount> {
    const now = dayjs().toISOString();
    const discounts = await this.prisma.discount.findMany({
      where: {
        ...where,
        public: true,
        AND: [
          {
            OR: [
              {
                validFrom: {
                  gte: now,
                },
              },
              {
                validFrom: {
                  equals: null,
                },
              },
            ],
          },
          {
            OR: [
              {
                validTo: {
                  equals: now,
                },
              },
              {
                validTo: {
                  equals: null,
                },
              },
            ],
          },
        ],
      },
    });
    const randomIndex = Math.floor(Math.random() * discounts.length);
    return discounts[randomIndex];
  }

  async getDiscounts() {
    return this.prisma.discount.findMany();
  }

  async deleteDiscount(where: Prisma.DiscountWhereUniqueInput) {
    try {
      return await this.prisma.discount.delete({ where });
    } catch (e) {
      this.handleException(e);
    }
  }

  private async checkDiscount(where: Prisma.DiscountWhereUniqueInput) {
    const discount = await this.prisma.discount.findUnique({ where });
    if (!discount) {
      throw new NotFoundException('Discount not found');
    }
  }

  private handleException(error: Error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          const conflictingField = error.meta['target'][0];
          throw new ConflictException(
            `Discount with this ${conflictingField} already exists`,
          );
        case 'P2025':
          throw new NotFoundException('Discount does not exist');
        default:
          throw new BadRequestException(error.code);
      }
    }
  }
}
