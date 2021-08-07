import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FilesService } from 'src/files/files.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateShopDto } from './dtos/create-shop.dto';
import { UpdateShopDto } from './dtos/update-shop.dto';
import { PublicShop } from './models/public.shop.model';

@Injectable()
export class ShopService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly filesService: FilesService,
  ) {}

  readonly public: Prisma.ShopSelect = {
    name: true,
    uuid: true,
    logo: {
      select: {
        url: true,
      },
    },
  };

  toUUID(name: string) {
    return name.replace(/ /gm, '-').toLowerCase();
  }

  async createShop(createShopDto: CreateShopDto) {
    const uuid = this.toUUID(createShopDto.name);
    try {
      return await this.prisma.shop.create({
        data: { ...createShopDto, uuid },
      });
    } catch (e) {
      this.handleException(e);
    }
  }

  async getShop(where: Prisma.ShopWhereUniqueInput) {
    await this.checkShop(where);
    return this.prisma.shop.findUnique({ where });
  }

  async getShops(discount?: Prisma.DiscountWhereInput) {
    return this.prisma.shop.findMany({
      where: {
        discounts: {
          some: discount,
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async updateShop(uuid: string, updateShopDto: UpdateShopDto) {
    try {
      return await this.prisma.shop.update({
        where: { uuid },
        data: updateShopDto,
      });
    } catch (e) {
      this.handleException(e);
    }
  }

  async updateLogo(uuid: string, buffer: Buffer, filename: string) {
    await this.checkShop({ uuid });
    const file = await this.filesService.uploadPublicFile(buffer, filename);
    return this.prisma.shop.update({
      where: { uuid },
      data: {
        logoId: file.id,
      },
    });
  }

  async deleteLogo(uuid: string) {
    const { logoId } = await this.getShop({ uuid });
    if (!logoId) {
      throw new NotFoundException('No logo found');
    }
    await this.filesService.deletePublicFile(logoId);
    return this.prisma.shop.update({
      where: { uuid },
      data: {
        logoId: undefined,
      },
    });
  }

  async deleteShop(shop: Prisma.ShopWhereUniqueInput) {
    try {
      return await this.prisma.shop.delete({
        where: shop,
      });
    } catch (e) {
      this.handleException(e);
    }
  }

  async getPublicShops(discount?: Prisma.DiscountWhereInput) {
    return this.prisma.shop.findMany({
      where: {
        discounts: {
          some: discount,
        },
        public: true,
      },
      select: this.public,
      orderBy: {
        name: 'asc',
      },
    });
  }

  async getPublicShop(where: Prisma.ShopWhereUniqueInput): Promise<PublicShop> {
    await this.checkShop(where);
    const shop = await this.prisma.shop.findFirst({
      where: {
        ...where,
        public: true,
      },
      select: this.public,
    });
    return shop as PublicShop;
  }

  private async checkShop(where: Prisma.ShopWhereUniqueInput) {
    const shop = await this.prisma.shop.findUnique({ where });
    if (!shop) {
      throw new NotFoundException('Shop not found');
    }
  }

  private handleException(error: Error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          const conflictingField = error.meta['target'][0];
          throw new ConflictException(
            `Shop with this ${conflictingField} already exists`,
          );
        case 'P2025':
          throw new NotFoundException('Shop does not exist');
        default:
          throw new BadRequestException(error.code);
      }
    }
  }
}
