import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as dayjs from 'dayjs';
import { Discount, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { FilesService } from 'src/files/files.service';
import { UpdateDiscountImagesDto } from './dto/update-discount-images.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { ShopService } from 'src/shop/shop.service';
import { CouponService } from 'src/coupon/coupon.service';
import { CouponState } from './models/coupon-state.model';

@Injectable()
export class DiscountService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly filesService: FilesService,
    private readonly shopService: ShopService,
    private readonly couponService: CouponService,
  ) {}

  private readonly logger = new Logger('DiscountService');

  async createDiscount(data: CreateDiscountDto) {
    await this.shopService.getShop({ id: data.shopId });
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

  getDiscountWithCouponsByUuid(uuid: string) {
    return this.prisma.discount.findUnique({
      where: { uuid },
      include: { coupons: true },
    });
  }

  async updateDiscountImages(id: number, files: UpdateDiscountImagesDto) {
    const fileUploadTasks = [];
    for (const f in files) {
      fileUploadTasks.push(this.updateImage(id, files[f], f));
    }
    await Promise.all(fileUploadTasks);
  }

  private async updateImage(
    id: number,
    image: Express.Multer.File,
    fieldName: string,
  ) {
    this.logger.verbose(`Updating ${fieldName} on discount ${id}`);
    const file = await this.filesService.uploadPublicFile(
      image[0].buffer,
      image[0].originalname,
    );
    const discount = await this.prisma.discount.update({
      where: { id },
      data: {
        [`${fieldName}Id`]: file.id,
      },
    });
    this.logger.verbose(`Updated ${fieldName} on discount ${id}`);
    return discount;
  }

  async getRandomDiscount(where: Prisma.DiscountWhereInput) {
    const discounts = await this.getPublicDiscounts(where);
    const randomIndex = Math.floor(Math.random() * discounts.length);
    return discounts[randomIndex];
  }

  async getDiscounts() {
    return this.prisma.discount.findMany();
  }

  async getCouponState(uuid: string): Promise<CouponState> {
    const free = await this.prisma.coupon.count({
      where: {
        discountUuid: uuid,
        discount: {
          public: true,
        },
        user: undefined,
      },
    });
    const used = await this.prisma.coupon.count({
      where: {
        discountUuid: uuid,
        discount: {
          public: true,
        },
        userId: { not: null },
      },
    });
    return {
      all: free + used,
      free,
      used,
    };
  }

  async getPublicDiscounts(
    where?: Prisma.DiscountWhereInput,
  ): Promise<Discount[]> {
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
                  lt: now,
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
      include: {
        thumbnail: {
          select: {
            url: true,
          },
        },
        image: {
          select: {
            url: true,
          },
        },
      },
    });
    return discounts;
  }

  async getPublicDiscount(uuid: string) {
    const now = dayjs().toISOString();
    const discount = await this.prisma.discount.findFirst({
      where: {
        uuid,
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
                  lt: now,
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
      include: {
        thumbnail: {
          select: {
            url: true,
          },
        },
        image: {
          select: {
            url: true,
          },
        },
        coupons: true,
      },
    });
    if (!discount) {
      throw new NotFoundException('Discount not found');
    }
    return discount;
  }

  async deleteDiscount(where: Prisma.DiscountWhereUniqueInput) {
    try {
      return await this.prisma.discount.delete({ where });
    } catch (e) {
      this.handleException(e);
    }
  }

  async updateDiscount(id: number, data: UpdateDiscountDto) {
    return await this.prisma.discount.update({ where: { id }, data });
  }

  async generateCoupon(userId: number, discountUuid: string) {
    return await this.couponService.linkCoupon(userId, discountUuid);
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
          throw new BadRequestException();
      }
    }
  }
}
