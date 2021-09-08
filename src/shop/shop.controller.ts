import {
  Body,
  CacheInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/role/role.guard';
import { CreateShopDto } from './dtos/create-shop.dto';
import { UpdateShopDto } from './dtos/update-shop.dto';
import { ShopService } from './shop.service';

@ApiTags('Shop')
@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  /**
   * Get public and private shops
   * @returns All shops
   */
  @ApiBearerAuth('Admin')
  @UseGuards(JwtAuthGuard, RoleGuard(Role.ADMIN))
  @Get()
  getShops(@Query('category') categoryUuid?: string) {
    return this.shopService.getShops({ categoryUuid });
  }

  /**
   * Get list of public shops
   * @returns List of public shops
   */
  @ApiBearerAuth('User')
  @ApiBearerAuth('Admin')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(CacheInterceptor)
  @Get()
  getPublicShops(@Query('category') categoryUuid?: string) {
    return this.shopService.getPublicShops({ categoryUuid });
  }

  /**
   * Get shop with uuid
   * @param uuid UUID of shop
   * @returns Shop
   */
  @ApiBearerAuth('Admin')
  @UseGuards(JwtAuthGuard, RoleGuard(Role.ADMIN))
  @Get(':uuid')
  getShop(@Param('uuid') uuid: string) {
    return this.shopService.getShop({ uuid });
  }

  @ApiBearerAuth('User')
  @ApiBearerAuth('Admin')
  @UseGuards(JwtAuthGuard)
  @Get(':uuid')
  getPublicShop(@Param('uuid') uuid: string) {
    return this.shopService.getPublicShop({ uuid });
  }

  /**
   * Create a shop
   * @param createShopDto Shop data
   * @returns Created shop
   */
  @ApiBearerAuth('Admin')
  @UseGuards(JwtAuthGuard, RoleGuard(Role.ADMIN))
  @Post()
  createShop(@Body() createShopDto: CreateShopDto) {
    return this.shopService.createShop(createShopDto);
  }

  /**
   * Delete shop with uuid
   * @param uuid UUID of shop
   * @returns Deleted shop
   */
  @ApiBearerAuth('Admin')
  @UseGuards(JwtAuthGuard, RoleGuard(Role.ADMIN))
  @Delete(':uuid')
  deleteShop(@Param('uuid') uuid: string) {
    return this.shopService.deleteShop({ uuid });
  }

  /**
   * Update shop with uuid
   * @param uuid UUID of shop
   * @param updateShopDto Shop data
   * @returns Updated shop
   */
  @ApiBearerAuth('Admin')
  @UseGuards(JwtAuthGuard, RoleGuard(Role.ADMIN))
  @Put(':uuid')
  updateShop(
    @Param('uuid') uuid: string,
    @Body() updateShopDto: UpdateShopDto,
  ) {
    return this.shopService.updateShop(uuid, updateShopDto);
  }

  @ApiBearerAuth('Admin')
  @UseGuards(JwtAuthGuard, RoleGuard(Role.ADMIN))
  @UseInterceptors(FileInterceptor('file'))
  @Post('logo/:uuid')
  updateLogo(
    @UploadedFile() file: Express.Multer.File,
    @Param('uuid') uuid: string,
  ) {
    return this.shopService.updateLogo(uuid, file.buffer, file.originalname);
  }

  @ApiBearerAuth('Admin')
  @UseGuards(JwtAuthGuard, RoleGuard(Role.ADMIN))
  @Delete('logo/:uuid')
  deleteLogo(@Param('uuid') uuid: string) {
    return this.shopService.deleteLogo(uuid);
  }
}
