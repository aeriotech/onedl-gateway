import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateDiscountDto } from './dto/create-discount.dto'

@Injectable()
export class DiscountService {
  constructor(private readonly prisma: PrismaService) {}

  async createDiscount(createDiscountDto: CreateDiscountDto) {
    return this.prisma.discount.create({
      data: createDiscountDto,
    })
  }
}
