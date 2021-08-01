import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FilesService } from 'src/files/files.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { ProfileUpdateDto } from './dto/profile-update.dto';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly filesService: FilesService,
  ) {}

  private public: Prisma.ProfileSelect = {
    firstName: true,
    lastName: true,
    bio: true,
    profilePicture: {
      select: {
        url: true,
      },
    },
    updatedAt: true,
  };

  async getPublicProfile(id: number) {
    const { profileId } = await this.userService.getUser({ id });
    return this.prisma.profile.findUnique({
      where: { id: profileId },
      select: this.public,
    });
  }

  async updatePublicProfile(id: number, profileUpdateDto: ProfileUpdateDto) {
    const { profileId } = await this.userService.getUser({ id });
    return this.prisma.profile.update({
      where: { id: profileId },
      data: profileUpdateDto,
      select: this.public,
    });
  }

  async updateProfilePicture(id: number, buffer: Buffer, filename: string) {
    const { profileId } = await this.userService.getUser({ id });
    const file = await this.filesService.uploadPublicFile(buffer, filename);
    return this.prisma.profile.update({
      where: { id: profileId },
      data: {
        profilePictureId: file.id,
      },
      select: this.public,
    });
  }

  async deleteProfilePicture(id: number) {
    const { profileId } = await this.userService.getUser({ id });
    const profile = await this.prisma.profile.findUnique({
      where: { id: profileId },
    });
    if (!profile.profilePictureId) {
      throw new NotFoundException('No profile picture found');
    }
    this.prisma.profile.update({
      where: {
        id: profileId,
      },
      data: {
        profilePictureId: undefined,
      },
    });
    this.filesService.deletePublicFile(profile.profilePictureId);
  }
}
