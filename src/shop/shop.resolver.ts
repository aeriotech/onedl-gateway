import { UseGuards } from '@nestjs/common';
import {
  Args,
  Field,
  InputType,
  Int,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Root,
} from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoleGuard } from 'src/role/role.guard';
import handlePrismaError from 'src/utils/prisma-error-handler';
import { CreateShopDto } from './dtos/create-shop.dto';
import { UpdateShopDto } from './dtos/update-shop.dto';
import { Shop } from './models/shop.model';

@InputType()
class ShopUniqueInput {
  @Field((type) => Int)
  id: number;

  @Field()
  uuid: string;
}

@Resolver(Shop)
export class ShopResolver {
  constructor(private readonly prisma: PrismaService) {}

  @ResolveField()
  async logo(@Root() shop: Shop) {
    return this.prisma.shop
      .findUnique({
        where: { id: shop.id },
      })
      .logo();
  }

  @UseGuards(RoleGuard(Role.ADMIN, Role.EDITOR))
  @Query((returns) => [Shop])
  async shops() {
    return await this.prisma.shop.findMany();
  }

  @UseGuards(RoleGuard(Role.ADMIN, Role.EDITOR))
  @Query((returns) => Shop, { nullable: true })
  async shop(
    @Args('where', { type: () => ShopUniqueInput })
    shopUniqueInput: ShopUniqueInput,
  ) {
    return await this.prisma.shop.findUnique({
      where: shopUniqueInput,
    });
  }

  @UseGuards(RoleGuard(Role.ADMIN, Role.EDITOR))
  @Mutation((returns) => Shop)
  async createShop(
    @Args('data', { type: () => CreateShopDto })
    createShopDto: CreateShopDto,
  ) {
    try {
      return await this.prisma.shop.create({
        data: createShopDto,
      });
    } catch (e) {
      handlePrismaError(e, 'Shop');
    }
  }

  @UseGuards(RoleGuard(Role.ADMIN, Role.EDITOR))
  @Mutation((returns) => Shop)
  async updateShop(
    @Args('where', { type: () => ShopUniqueInput })
    shopUniqueInput: ShopUniqueInput,
    @Args('data', { type: () => UpdateShopDto })
    updateShopDto: UpdateShopDto,
  ) {
    try {
      return await this.prisma.shop.update({
        where: shopUniqueInput,
        data: updateShopDto,
      });
    } catch (e) {
      handlePrismaError(e, 'Shop');
    }
  }

  @UseGuards(RoleGuard(Role.ADMIN, Role.EDITOR))
  @Mutation((returns) => Shop)
  async deleteShop(
    @Args('where', { type: () => ShopUniqueInput })
    shopUniqueInput: ShopUniqueInput,
  ) {
    try {
      return await this.prisma.shop.delete({
        where: shopUniqueInput,
      });
    } catch (e) {
      handlePrismaError(e, 'Shop');
    }
  }
}
