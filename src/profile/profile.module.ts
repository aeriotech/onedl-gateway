import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilesService } from 'src/files/files.service';
import { UserModule } from 'src/user/user.module';
import { ProfileResolver } from './profile.resolver';

@Module({
  imports: [UserModule],
  providers: [ProfileService, PrismaService, FilesService, ProfileResolver],
  controllers: [ProfileController],
})
export class ProfileModule {}
