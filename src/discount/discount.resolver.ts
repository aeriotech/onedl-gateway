import { UseGuards } from '@nestjs/common';
import {
  Args,
  Field,
  InputType,
  Int,
  Query,
  ResolveField,
  Resolver,
  Root,
} from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { IsIn, IsInt, IsString, IsUUID } from 'class-validator';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoleGuard } from 'src/role/role.guard';
import { Discount } from './models/discount.model';

@InputType()
class DiscountUniqueInput {
  @IsInt()
  @Field((type) => Int, { nullable: true })
  id?: number;

  @IsString()
  @Field({ nullable: true })
  uuid?: string;
}

@Resolver(Discount)
export class DiscountResolver {
  constructor(private readonly prisma: PrismaService) {}

  @ResolveField()
  async image(@Root() discount: Discount) {
    return this.prisma.discount
      .findUnique({
        where: { id: discount.id },
      })
      .image();
  }

  @ResolveField()
  async thumbnail(@Root() discount: Discount) {
    return this.prisma.discount
      .findUnique({
        where: { id: discount.id },
      })
      .thumbnail();
  }

  @ResolveField()
  async shop(@Root() discount: Discount) {
    return this.prisma.discount
      .findUnique({
        where: { id: discount.id },
      })
      .shop();
  }

  @UseGuards(RoleGuard(Role.ADMIN))
  @Query((returns) => [Discount])
  async discounts() {
    return this.prisma.discount.findMany();
  }

  @UseGuards(RoleGuard(Role.ADMIN))
  @Query((returns) => Discount, { nullable: true })
  async discount(
    @Args('where', { type: () => DiscountUniqueInput })
    discountUniqueInput: DiscountUniqueInput,
  ) {
    return this.prisma.discount.findUnique({
      where: discountUniqueInput,
    });
  }
}
