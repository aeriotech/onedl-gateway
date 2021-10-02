import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Coupon, Prisma } from '@prisma/client';
import * as dayjs from 'dayjs';
import { DiscountService } from 'src/discount/discount.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { BulkCreateCouponDto } from './dtos/bulk-create-coupon.dto';
import { AgeLimitException } from './exceptions/age-limit.exception';
import { CouponLimitException } from './exceptions/coupon-limit.exception';
import { Coupons } from './models/coupons.model';
import { PublicCoupon } from './models/public-coupon.model';

@Injectable()
export class CouponService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => DiscountService))
    private readonly discountService: DiscountService,
    private readonly userService: UserService,
  ) {}

  private readonly logger: Logger = new Logger('CouponService');

  async getCoupons(user: Prisma.UserWhereUniqueInput): Promise<Coupons> {
    await this.userService.check(user);
    const coupons = (await this.prisma.coupon.findMany({
      where: {
        user,
      },
    })) as unknown as Array<PublicCoupon>;

    return {
      coupons,
    };
  }

  async getPublicCoupons(userId?: number) {
    const coupons = await this.prisma.coupon.findMany({
      where: {
        OR: [
          {
            userId,
          },
          {
            public: true,
          },
        ],
      },
    });
    return coupons;
  }

  async getPublicCoupon(
    where: Prisma.CouponWhereUniqueInput,
  ): Promise<PublicCoupon> {
    return this.prisma.coupon.findUnique({
      where,
    }) as unknown as Promise<PublicCoupon>;
  }

  async linkCoupon(userId: number, discountUuid: string) {
    const user = await this.userService.find({ id: userId });

    const discount = await this.discountService.getDiscount({
      uuid: discountUuid,
    });

    if (discount.ageLimit && !user.ageConfirmed) {
      this.logger.verbose(
        `${user.username} tried to link a coupon (${discountUuid}), but didn't have age confirmed`,
      );
      throw new AgeLimitException();
    }

    const currentCoupons = user.coupons.filter(
      (coupon) => coupon.discountUuid === discount.uuid,
    );

    if (currentCoupons.length >= discount.maxPerUser) {
      this.logger.verbose(
        `${user.username} tried to link a coupon (${discountUuid}), but the limit was reached`,
      );
      throw new CouponLimitException();
    }

    try {
      const coupon = await this.prisma.coupon.findFirst({
        where: {
          user: null,
          used: false,
          discountUuid: discount.uuid,
        },
      });
      this.logger.verbose(`${user.username} linked a coupon (${discountUuid})`);

      const updated = await this.prisma.coupon.update({
        where: { id: coupon.id },
        data: {
          userId,
          used: true,
        },
      });
      return updated;
    } catch (e) {
      this.handleException(e);
    }
  }

  async generateCoupon(
    userId: number,
    where: Prisma.DiscountWhereUniqueInput,
  ): Promise<Coupon> {
    const discount = await this.discountService.getDiscount(where);
    const validTo = discount.validTime
      ? dayjs().add(discount.validTime, 'hour').toISOString()
      : null;
    const coupon = await this.prisma.coupon.create({
      data: {
        validTo,
        discountUuid: discount.uuid,
        userId: userId,
        code: 'COUPON_CODE_NOT_DEFINED',
      },
    });
    return coupon;
  }

  async bulkAddCoupons(bulkCreateCouponDto: BulkCreateCouponDto) {
    const { codes, discountUuid } = bulkCreateCouponDto;
    const { validTo, validTime } = await this.discountService.getDiscount({
      uuid: discountUuid,
    });

    const coupons = codes.map<Prisma.CouponCreateManyInput>((code) => ({
      code,
      discountUuid,
      validTo: dayjs().add(validTime, 'hour').isAfter(validTo)
        ? validTo
        : dayjs().add(validTime, 'hour').toDate(),
    }));

    return this.prisma.coupon.createMany({
      data: coupons,
    });
  }

  private handleException(error: Error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          const conflictingField = error.meta['target'][0];
          throw new ConflictException(
            `Coupon with this ${conflictingField} already exists`,
          );
        case 'P2025':
          throw new NotFoundException('Discount does not exist');
        default:
          throw new BadRequestException();
      }
    }
  }
}
