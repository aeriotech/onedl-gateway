import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { UserId } from 'src/user/user.decorator'
import { ProfileUpdateDto } from './dto/profile-update.dto'
import { ProfileService } from './profile.service'
import { Express } from 'express'

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getPublicProfile(@UserId() id: number) {
    return this.profileService.getPublicProfile(id)
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  updateProfile(
    @UserId() id: number,
    @Body() profileUpdateDto: ProfileUpdateDto,
  ) {
    return this.profileService.updatePublicProfile(id, profileUpdateDto)
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('profile-picture')
  updateProfilePicture(
    @UserId() id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.profileService.updateProfilePicture(
      id,
      file.buffer,
      file.originalname,
    )
  }

  @UseGuards(JwtAuthGuard)
  @Delete('profile-picture')
  deleteProfilePicture(@UserId() id: number) {
    return this.profileService.deleteProfilePicture(id)
  }
}
