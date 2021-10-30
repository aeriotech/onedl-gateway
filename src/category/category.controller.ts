import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PublicFilter } from 'src/utils/filter.interceptor';
import { CategoryService } from './category.service';
import { PublicCategory } from './models/public-category.model';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiBearerAuth('User')
  @UseInterceptors(PublicFilter(PublicCategory))
  getCategories() {
    return this.categoryService.getCategoriesWithDiscounts();
  }
}
