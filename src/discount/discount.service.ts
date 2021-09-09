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

@Injectable()
export class DiscountService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly filesService: FilesService,
  ) {}

  private readonly logger = new Logger('DiscountService');

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

  async updateDiscountImages(
    where: Prisma.DiscountWhereUniqueInput,
    files: UpdateDiscountImagesDto,
  ) {
    const fileUploadTasks = [];
    for (const f in files) {
      fileUploadTasks.push(this.updateImage(where, files[f], f));
    }
    await Promise.all(fileUploadTasks);
  }

  private async updateImage(
    where: Prisma.DiscountWhereUniqueInput,
    image: Express.Multer.File,
    fieldName: string,
  ) {
    this.logger.verbose(`Updating ${fieldName} on discount ${where.id}`);
    const file = await this.filesService.uploadPublicFile(
      image[0].buffer,
      image[0].originalname,
    );
    const discount = await this.prisma.discount.update({
      where,
      data: {
        [`${fieldName}Id`]: file.id,
      },
    });
    this.logger.verbose(`Updated ${fieldName} on discount ${where.id}`);
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
    });
    return discounts;
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
