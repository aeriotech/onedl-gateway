import {
  BadGatewayException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Prisma, Shop } from '@prisma/client';
import { randomUUID } from 'crypto';
import * as dayjs from 'dayjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { PublicShop } from 'src/shop/models/public.shop.model';
import { ShopService } from 'src/shop/shop.service';
import { UserService } from 'src/user/user.service';
import { DailySelect } from './models/daily.select.model';
import { DailyShops } from './models/daily.shops.model';

@Injectable()
export class DailyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly shopService: ShopService,
  ) {}

  async checkAvailability(userId: number): Promise<DailyAvailable> {
    const user = await this.userService.getUser({ id: userId });

    const lastDaily = dayjs(user.lastDaily);
    const nextDaily = lastDaily.add(1, 'day'); // TODO: Fetch from default config or user specific multiplier

    const available = dayjs().isAfter(nextDaily);

    return {
      available,
      availableAt: nextDaily.toISOString(),
    };
  }

  private async getRandomShops(): Promise<Array<Shop>> {
    const allShops = await this.prisma.shop.findMany({
      where: { public: true },
    });

    const selectedShops: Array<Shop> = [];
    for (let i = 0; i < 9; i++) {
      const randomShopIndex = Math.floor(Math.random() * allShops.length);
      selectedShops.push(allShops[randomShopIndex]);
    }

    return selectedShops;
  }

  private async getPublicShopsFromIds(
    shopIds: Array<number>,
  ): Promise<Array<PublicShop>> {
    return Promise.all(
      shopIds.map((id) => this.shopService.getPublicShop({ id })),
    );
  }

  async start(userId: number): Promise<DailyShops> {
    const dailySession = await this.prisma.dailySession.findUnique({
      where: { userId },
    });

    if (dailySession) {
      return {
        shops: await this.getPublicShopsFromIds(dailySession.shopIds),
      };
    }

    const { available } = await this.checkAvailability(userId);
    if (!available) {
      throw new ForbiddenException('Daily discount is currently not available');
    }

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        lastDaily: dayjs().toISOString(),
      },
    });

    try {
      await this.prisma.dailySession.delete({ where: { userId } });
    } catch (e) {}

    const selectedShops = await this.getRandomShops();

    await this.prisma.dailySession.create({
      data: {
        userId,
        shopIds: selectedShops.map((shop) => shop.id),
      },
    });

    const publicSelectedShops = await this.getPublicShopsFromIds(
      selectedShops.map((shop) => shop.id),
    );

    return {
      shops: publicSelectedShops,
    };
  }

  async select(userId: number, selected: number): Promise<DailySelect> {
    return {
      discount: {},
    };
  }
}
