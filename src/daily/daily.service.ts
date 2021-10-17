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
import { DailyAvailableAt } from './models/daily-available.model';
import { DailySelect } from './models/daily-select.model';
import { DailyShops } from './models/daily-shops.model';
import { DailyAvailable } from './dto/daily-available.dto';
import { plainToClass } from 'class-transformer';
import { PublicDiscount } from 'src/discount/models/public-discount.model';

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

  async getAllPublic() {
    return this.prisma.daily.findMany({
      where: {
        public: true,
        AND: [
          {
            OR: [
              {
                availableFrom: {
                  equals: null,
                },
              },
              {
                availableFrom: {
                  lte: new Date(),
                },
              },
            ],
          },
          {
            OR: [
              {
                availableTo: {
                  equals: null,
                },
              },
              {
                availableTo: {
                  gt: new Date(),
                },
              },
            ],
          },
        ],
      },
      include: {
        background: {
          select: {
            url: true,
          },
        },
        thumbnail: {
          select: {
            url: true,
          },
        },
      },
    });
  }

  async getPublic(dailyUuid) {
    return this.prisma.daily.findFirst({
      where: {
        uuid: dailyUuid,
        availableFrom: {
          lte: new Date(),
        },
        availableTo: {
          gt: new Date(),
        },
      },
    });
  }

  async isAvailable(
    userId: number,
    dailyUuid: string,
  ): Promise<DailyAvailable> {
    const claimed = await this.checkAlreadyClaimed(userId, dailyUuid);
    return {
      available: !claimed,
    };
  }

  async getCategories(dailyUuid: string) {
    const daily = await this.prisma.daily.findFirst({
      where: { uuid: dailyUuid },
      include: {
        dailyDiscountMap: {
          include: {
            discount: {
              include: {
                category: {
                  include: {
                    background: {
                      select: {
                        url: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!daily) {
      throw new NotFoundException('Daily not found');
    }

    // Map discounts to categories
    const mappedCategories = daily.dailyDiscountMap.map(
      (d) => d.discount.category,
    );

    const categories = mappedCategories.filter(
      (d, i) => mappedCategories.indexOf(d) === i,
    );

    return categories;
  }

  async claimDailyDiscount(userId: number, dailyUuid: string) {
    const alreadyClaimed = await this.checkAlreadyClaimed(userId, dailyUuid);
    if (alreadyClaimed) {
      throw new ForbiddenException('Not available');
    }

    const dailyDiscount = await this.getRandomDailyDiscount(dailyUuid);

    // Adds coupon to the user
    await this.discountService.claimCoupon(userId, dailyDiscount.discountId);

    // Adds user to the daily count
    await this.addUserCount(userId, dailyUuid);

    const publicDiscount = plainToClass(PublicDiscount, dailyDiscount.discount);

    return { ...dailyDiscount, discount: publicDiscount };
  }

  private async getRandomDailyDiscount(dailyUuid: string) {
    // Find the daily discount
    const daily = await this.prisma.daily.findUnique({
      where: {
        uuid: dailyUuid,
      },
      include: {
        dailyDiscountMap: {
          include: {
            image: {
              select: {
                url: true,
              },
            },
            discount: {
              include: {
                image: {
                  select: {
                    url: true,
                  },
                },
                thumbnail: {
                  select: {
                    url: true,
                  },
                },
              },
            },
          },
        },
        dailyCount: true,
      },
    });

    if (!daily) {
      throw new NotFoundException('Daily not found');
    }

    // Find today's user count
    const dailyCount = await this.prisma.dailyDiscountCount.findFirst({
      where: {
        dailyId: daily.id,
        createdAt: {
          gte: dayjs().startOf('day').toDate(),
          lt: dayjs().endOf('day').toDate(),
        },
      },
      include: {
        users: true,
      },
    });

    // Filter discounts
    const discounts = daily.dailyDiscountMap.filter(
      (discount) =>
        (!discount.availableFrom || dayjs().isAfter(discount.availableFrom)) &&
        (!discount.availableTo || dayjs().isBefore(discount.availableTo)),
    );

    // Check if there is an discount override available
    const override = discounts.find(
      (discount) => discount.countTrigger === dailyCount?.users?.length + 1,
    );

    // Return the override
    if (override) {
      return override;
    }

    // Calculate sum of all discount probabilities
    const sum = discounts.reduce((acc, cur) => acc + cur.probability, 0);

    // Get random number between 0 and sum
    const random = Math.random() * sum;

    // Get random discount
    let currentSum = 0;
    for (const discount of discounts) {
      currentSum += discount.probability ?? 0;
      if (random < currentSum) {
        return discount;
      }
    }

    throw new BadRequestException('No discounts found');
  }

  async checkAlreadyClaimed(userId: number, dailyUuid: string) {
    const userCount = await this.prisma.dailyDiscountCount.count({
      where: {
        createdAt: {
          gte: dayjs().startOf('day').toDate(),
          lt: dayjs().endOf('day').toDate(),
        },
        daily: {
          uuid: dailyUuid,
        },
        users: {
          some: {
            id: userId,
          },
        },
      },
    });

    return !!userCount;
  }

  async addUserCount(userId: number, dailyUuid: string) {
    const daily = await this.prisma.daily.findFirst({
      where: { uuid: dailyUuid },
    });

    let dailyCount = await this.prisma.dailyDiscountCount.findFirst({
      where: {
        daily: {
          uuid: dailyUuid,
        },
        createdAt: {
          gte: dayjs().startOf('day').toDate(),
          lt: dayjs().endOf('day').toDate(),
        },
      },
    });

    if (!dailyCount) {
      dailyCount = await this.prisma.dailyDiscountCount.create({
        data: {
          dailyId: daily.id,
        },
      });
    }

    await this.prisma.dailyDiscountCount.update({
      where: { id: dailyCount.id },
      data: {
        users: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  // Legacy Code //

  async checkAvailability(userId: number): Promise<DailyAvailableAt> {
    const user = await this.userService.find({ id: userId });

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

    const coupon = await this.couponService.generateCoupon(
      userId,
      randomDiscount,
    );

    const publicCoupon = await this.couponService.getPublicCoupon({
      id: coupon.id,
    });

    await this.deleteDailySession({ userId });

    return {
      coupon: publicCoupon,
    };
  }
}
