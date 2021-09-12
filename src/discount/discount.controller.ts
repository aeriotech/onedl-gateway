import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { RoleGuard } from 'src/role/role.guard';
import { PublicFilter } from 'src/utils/filter.interceptor';
import { DiscountService } from './discount.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { PublicDiscount } from './models/public-discount.model';
import { Public } from '../auth/public.decorator';
import { UpdateDiscountDto } from './dto/update-discount.dto';

@ApiTags('Discount')
@Controller('discounts')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  /**
   * Get a discount by id
   * @param id Discount id
   * @returns Discount
   */
  @Get(':id')
  @ApiBearerAuth('Admin')
  @UseGuards(RoleGuard(Role.ADMIN))
  getDiscount(@Param('id') id: number) {
    return this.discountService.getDiscount({ id });
  }

  @Get()
  @Public()
  @UseInterceptors(PublicFilter(PublicDiscount))
  getPublicDiscounts() {
    return this.discountService.getPublicDiscounts();
  }

  @Get()
  @ApiBearerAuth('Admin')
  @UseGuards(RoleGuard(Role.ADMIN))
  getDiscounts() {
    return this.discountService.getDiscounts();
  }

  /**
   * Create a new discount
   * @param createDiscountDto Discount data
   * @returns The created discount
   */
  @Post()
  @ApiBearerAuth('Admin')
  @UseGuards(RoleGuard(Role.ADMIN))
  createDiscount(@Body() createDiscountDto: CreateDiscountDto) {
    return this.discountService.createDiscount(createDiscountDto);
  }

  /**
   * Update the discount
   * @param id Discount id
   * @param updateDiscountDto Discount data
   */
  @Put(':id')
  @ApiBearerAuth('Admin')
  @UseGuards(RoleGuard(Role.ADMIN))
  updateDiscount(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDiscountDto: UpdateDiscountDto,
  ) {
    return this.discountService.updateDiscount(id, updateDiscountDto);
  }

  /**
   * Update discount images
   * @param id Discount id
   * @param files Images
   * @returns Updated discount
   */
  @Put(':id/images')
  @ApiBearerAuth('Admin')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        thumbnail: {
          type: 'string',
          format: 'binary',
        },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'thumbnail', maxCount: 1 },
      { name: 'image', maxCount: 1 },
    ]),
  )
  @UseGuards(RoleGuard(Role.ADMIN))
  updateDiscountImages(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles()
    files: { thumbnail?: Express.Multer.File[]; image?: Express.Multer.File[] },
  ) {
    return this.discountService.updateDiscountImages(id, files);
  }

  /**
   * Delete the discount
   * @param id Discount id
   * @returns The deleted discount
   */
  @Delete(':id')
  @ApiBearerAuth('Admin')
  @UseGuards(RoleGuard(Role.ADMIN))
  deleteDiscount(@Param('id') id: number) {
    return this.discountService.deleteDiscount({ id });
  }
}
