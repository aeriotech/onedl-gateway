import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Role } from '@prisma/client'
import { timeStamp } from 'console'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { RoleGuard } from 'src/role/role.guard'
import { CreateShopDto } from './dtos/create-shop.dto'
import { UpdateShopDto } from './dtos/update-shop.dto'
import { ShopService } from './shop.service'

@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  /**
   * Get public and private shops
   * @returns All shops
   */
  @UseGuards(JwtAuthGuard, RoleGuard(Role.ADMIN))
  @Get()
  async getShops() {
    return this.shopService.getShops()
  }

  /**
   * Get list of public shops
   * @returns List of public shops
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  async getPublicShops() {
    return this.shopService.getPublicShops()
  }

  /**
   * Get shop with uuid
   * @param uuid UUID of shop
   * @returns Shop
   */
  @UseGuards(JwtAuthGuard, RoleGuard(Role.ADMIN))
  @Get(':uuid')
  async getShop(@Param('uuid') uuid: string) {
    return this.shopService.getShop({ uuid })
  }

  @UseGuards(JwtAuthGuard)
  @Get(':uuid')
  async getPublicShop(@Param('uuid') uuid: string) {
    return this.shopService.getPublicShop(uuid)
  }

  /**
   * Create a shop
   * @param createShopDto Shop data
   * @returns Created shop
   */
  @UseGuards(JwtAuthGuard, RoleGuard(Role.ADMIN))
  @Post()
  async createShop(@Body() createShopDto: CreateShopDto) {
    return this.shopService.createShop(createShopDto)
  }

  /**
   * Delete shop with uuid
   * @param uuid UUID of shop
   * @returns Deleted shop
   */
  @UseGuards(JwtAuthGuard, RoleGuard(Role.ADMIN))
  @Delete(':uuid')
  async deleteShop(@Param('uuid') uuid: string) {
    return this.shopService.deleteShop({ uuid })
  }

  /**
   * Update shop with uuid
   * @param uuid UUID of shop
   * @param updateShopDto Shop data
   * @returns Updated shop
   */
  @UseGuards(JwtAuthGuard, RoleGuard(Role.ADMIN))
  @Put(':uuid')
  async updateShop(
    @Param('uuid') uuid: string,
    @Body() updateShopDto: UpdateShopDto,
  ) {
    return this.shopService.updateShop(uuid, updateShopDto)
  }

  @UseGuards(JwtAuthGuard, RoleGuard(Role.ADMIN))
  @UseInterceptors(FileInterceptor('file'))
  @Post('logo/:uuid')
  async updateLogo(
    @UploadedFile() file: Express.Multer.File,
    @Param('uuid') uuid: string,
  ) {
    return this.shopService.updateLogo(uuid, file.buffer, file.originalname)
  }

  @UseGuards(JwtAuthGuard, RoleGuard(Role.ADMIN))
  @Delete('logo/:uuid')
  async deleteLogo(@Param('uuid') uuid: string) {
    return this.shopService.deleteLogo(uuid)
  }
}
