import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as dayjs from 'dayjs';
import { Discount, DiscountType, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { FilesService } from 'src/files/files.service';
import { UpdateDiscountImagesDto } from './dto/update-discount-images.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { ShopService } from 'src/shop/shop.service';
import { CouponService } from 'src/coupon/coupon.service';
import { CouponState } from './models/coupon-state.model';
import { User } from 'src/user/models/user.model';
import { UserService } from 'src/user/user.service';

@Injectable()
export class DiscountService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly filesService: FilesService,
    private readonly shopService: ShopService,
    private readonly couponService: CouponService,
    private readonly userService: UserService,
  ) {}

  private readonly logger = new Logger(DiscountService.name);

  async createDiscount(data: CreateDiscountDto) {
    await this.shopService.getShop({ id: data.shopId });
    try {
      return await this.prisma.discount.create({ data });
    } catch (e) {
      this.handleException(e);
    }
  }

  async findById(id: number) {
    return this.findOne({ id });
  }

  async findByUuid(uuid: string) {
    return this.findOne({ uuid });
  }

  async findOne(where: Prisma.DiscountWhereUniqueInput) {
    await this.exists(where);
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
        user: null,
      },
    });
    const used = await this.prisma.coupon.count({
      where: {
        discountUuid: uuid,
        discount: {
          public: true,
        },
        user: { isNot: null },
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

  async getPublic(uuid: string) {
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
        shop: {
          select: {
            logo: {
              select: {
                url: true,
              },
            },
          },
        },
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

  async claimCouponPublic(userId: number, discountUuid: string) {
    const { id } = await this.getPublic(discountUuid);
    await this.claimCoupon(userId, id);
  }

  async claimCoupon(userId: number, discountId: number) {
    const discount = await this.findById(discountId);
    switch (discount.discountType) {
      case DiscountType.GENERATE:
        return this.couponService.generateCoupon(userId, discount);

      case DiscountType.CLAIM:
        return this.couponService.linkCoupon(userId, discount);
    }
  }

  async exists(where: Prisma.DiscountWhereUniqueInput) {
    const discount = await this.prisma.discount.findFirst({ where });
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
