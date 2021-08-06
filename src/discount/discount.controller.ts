import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/role/role.guard';
import { DiscountService } from './discount.service';
import { CreateDiscountDto } from './dto/create-discount.dto';

@Controller('discount')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @UseGuards(JwtAuthGuard, RoleGuard(Role.ADMIN))
  @Post()
  createDiscount(@Body() createDiscountDto: CreateDiscountDto) {
    return this.discountService.createDiscount(createDiscountDto);
  }

  @UseGuards(JwtAuthGuard, RoleGuard(Role.ADMIN))
  @Get(':id')
  getDiscount(@Param('id') id: number) {
    return this.discountService.getDiscount({ id });
  }

  @UseGuards(JwtAuthGuard, RoleGuard(Role.ADMIN))
  @Get()
  getDiscounts() {
    return this.discountService.getDiscounts();
  }

  @UseGuards(JwtAuthGuard, RoleGuard(Role.ADMIN))
  @Delete(':id')
  deleteDiscount(@Param('id') id: number) {
    return this.discountService.deleteDiscount({ id });
  }
}
