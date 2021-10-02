import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { PostService } from './post.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PublicFilter } from 'src/utils/filter.interceptor';
import { PublicPost } from './models/public-post.model';
import { Public } from 'src/auth/public.decorator';

@ApiTags('Posts Endpoint')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOkResponse({
    description: 'List of all posts',
    type: PublicPost,
    isArray: true,
  })
  @Public()
  @UseInterceptors(PublicFilter(PublicPost))
  @Get()
  findAll() {
    return this.postService.findAllPublic();
  }
}
