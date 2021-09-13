import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Shop } from '@prisma/client';
import * as dayjs from 'dayjs';
import { CouponService } from 'src/coupon/coupon.service';
import { DiscountService } from 'src/discount/discount.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PublicShop } from 'src/shop/models/public.shop.model';
import { ShopService } from 'src/shop/shop.service';
import { UserService } from 'src/user/user.service';
import { DailyAvailable } from './models/daily.available.model';
import { DailySelect } from './models/daily-select.model';
import { DailyShops } from './models/daily.shops.model';

@Injectable()
export class DailyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly shopService: ShopService,
    private readonly discountService: DiscountService,
    private readonly couponService: CouponService,
  ) {}

  // TODO: Fetch from config database
  private readonly dailyDuration = 24; // TODO: User specific
  private readonly selectAmount = 1;
  private readonly displayAmount = 4;

  async checkAvailability(userId: number): Promise<DailyAvailable> {
    const user = await this.userService.getUser({ id: userId });

    const lastDaily = dayjs(user.lastDaily);
    const nextDaily = lastDaily.add(this.dailyDuration, 'hour');

    const available = dayjs().isAfter(nextDaily);

    return {
      available,
      availableAt: nextDaily.toISOString(),
    };
  }

  private async getRandomShops(): Promise<Array<Shop>> {
    const now = dayjs().toISOString();
    const allShops = await this.prisma.shop.findMany({
      where: {
        public: true,
        discounts: {
          some: {
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
        },
      },
    });

    if (allShops.length === 0) {
      throw new NotFoundException('No shops available');
    }

    const selectedShops: Array<Shop> = [];
    for (let i = 0; i < this.displayAmount; i++) {
      // TODO: Get amount of coupons from config
      const randomShopIndex = Math.floor(Math.random() * allShops.length);
      selectedShops.push(allShops[randomShopIndex]);
    }

    return selectedShops;
  }

  private async deleteDailySession(where: Prisma.DailySessionWhereUniqueInput) {
    try {
      return this.prisma.dailySession.delete({ where });
    } catch (e) {}
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

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        lastDaily: dayjs().toISOString(),
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
    const dailySession = await this.prisma.dailySession.findUnique({
      where: { userId },
    });

    if (!dailySession) {
      throw new NotFoundException('No daily discount session started');
    }

    if (selected < 0 || selected > this.displayAmount - 1) {
      throw new BadRequestException('Number is out of range');
    }

    const selectedShopId = dailySession.shopIds[selected];

    const randomDiscount = await this.discountService.getRandomDiscount({
      shopId: selectedShopId,
    });

    const coupon = await this.couponService.generateCoupon(userId, {
      id: randomDiscount.id,
    });

    const publicCoupon = await this.couponService.getPublicCoupon({
      id: coupon.id,
    });

    await this.deleteDailySession({ userId });

    return {
      coupon: publicCoupon,
    };
  }
}
