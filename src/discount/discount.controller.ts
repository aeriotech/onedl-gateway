import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/role/role.guard';
import { PublicFilter } from 'src/utils/filter.interceptor';
import { DiscountService } from './discount.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { PublicDiscount } from './models/public-discount.model';

@ApiTags('Discount')
@Controller('discount')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @ApiBearerAuth('User')
  @ApiBearerAuth('Admin')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(PublicFilter(PublicDiscount))
  @Get()
  getPublicDiscounts() {
    return this.discountService.getPublicDiscounts();
  }

  @ApiBearerAuth('Admin')
  @UseGuards(JwtAuthGuard, RoleGuard(Role.ADMIN))
  @Post()
  createDiscount(@Body() createDiscountDto: CreateDiscountDto) {
    return this.discountService.createDiscount(createDiscountDto);
  }

  @ApiBearerAuth('Admin')
  @UseGuards(JwtAuthGuard, RoleGuard(Role.ADMIN))
  @Get(':id')
  getDiscount(@Param('id') id: number) {
    return this.discountService.getDiscount({ id });
  }

  @ApiBearerAuth('Admin')
  @UseGuards(JwtAuthGuard, RoleGuard(Role.ADMIN))
  @Get()
  getDiscounts() {
    return this.discountService.getDiscounts();
  }

  @ApiBearerAuth('Admin')
  @UseGuards(JwtAuthGuard, RoleGuard(Role.ADMIN))
  @Delete(':id')
  deleteDiscount(@Param('id') id: number) {
    return this.discountService.deleteDiscount({ id });
  }
}
