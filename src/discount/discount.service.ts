import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDiscountDto } from './dto/create-discount.dto';

@Injectable()
export class DiscountService {
  constructor(private readonly prisma: PrismaService) {}

  toUUID(name: string) {
    return name.replace(/ /gm, '-').toLowerCase();
  }

  async createDiscount(data: CreateDiscountDto) {
    const uuid = this.toUUID(data.name);
    try {
      return await this.prisma.discount.create({
        data: {
          ...data,
          uuid,
        },
      });
    } catch (e) {
      this.handleException(e);
    }
  }

  async getDiscount(where: Prisma.DiscountWhereUniqueInput) {
    try {
      return await this.prisma.discount.findUnique({ where });
    } catch (e) {
      this.handleException(e);
    }
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
