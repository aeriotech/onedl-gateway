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
import { IsInt } from 'class-validator';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoleGuard } from 'src/role/role.guard';
import handlePrismaError from 'src/utils/prisma-error-handler';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './models/post.model';

@InputType()
class PostUniqueInput {
  @IsInt()
  @Field((type) => Int)
  id: number;
}

@Resolver(Post)
export class PostResolver {
  constructor(private readonly prisma: PrismaService) {}

  @ResolveField()
  async image(@Root() post: Post) {
    return this.prisma.post
      .findUnique({
        where: { id: post.id },
      })
      .image();
  }

  @UseGuards(RoleGuard(Role.ADMIN, Role.EDITOR))
  @Query((returns) => [Post], { nullable: true })
  async posts() {
    return await this.prisma.post.findMany();
  }

  @UseGuards(RoleGuard(Role.ADMIN, Role.EDITOR))
  @Query((returns) => Post, { nullable: true })
  async post(
    @Args('where', { type: () => PostUniqueInput })
    postUniqueInput: PostUniqueInput,
  ) {
    return await this.prisma.post.findUnique({
      where: postUniqueInput,
    });
  }

  @UseGuards(RoleGuard(Role.ADMIN, Role.EDITOR))
  @Mutation((returns) => Post)
  async createPost(
    @Args('data', { type: () => CreatePostDto })
    createPostDto: CreatePostDto,
  ) {
    try {
      return await this.prisma.post.create({
        data: createPostDto,
      });
    } catch (e) {
      handlePrismaError(e, 'Post');
    }
  }

  @UseGuards(RoleGuard(Role.ADMIN, Role.EDITOR))
  @Mutation((returns) => Post)
  async updatePost(
    @Args('where', { type: () => PostUniqueInput })
    postUniqueInput: PostUniqueInput,
    @Args('data', { type: () => UpdatePostDto })
    updatePostDto: UpdatePostDto,
  ) {
    try {
      return await this.prisma.post.update({
        where: postUniqueInput,
        data: updatePostDto,
      });
    } catch (e) {
      handlePrismaError(e, 'Post');
    }
  }

  @UseGuards(RoleGuard(Role.ADMIN, Role.EDITOR))
  @Mutation((returns) => Post)
  async deletePost(
    @Args('where', { type: () => PostUniqueInput })
    postUniqueInput: PostUniqueInput,
  ) {
    try {
      return await this.prisma.post.delete({
        where: postUniqueInput,
      });
    } catch (e) {
      handlePrismaError(e, 'Post');
    }
  }
}
