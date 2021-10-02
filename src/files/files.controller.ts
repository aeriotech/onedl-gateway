import { Role } from '.prisma/client';
import {
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/role/role.guard';
import { FilesService } from './files.service';

@ApiTags('Files Endpoint')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @ApiBearerAuth('Admin')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseGuards(RoleGuard(Role.ADMIN, Role.EDITOR))
  @UseInterceptors(FileInterceptor('files'))
  async upload(@UploadedFile() files: Express.Multer.File[]) {
    return Promise.all(
      files.map((file) =>
        this.filesService.uploadPublicFile(file.buffer, file.originalname),
      ),
    );
  }

  @Delete(':id')
  @ApiBearerAuth('Admin')
  @UseGuards(RoleGuard(Role.ADMIN, Role.EDITOR))
  async delete(@Param('id') id: number) {
    return this.filesService.deletePublicFile(+id);
  }
}
