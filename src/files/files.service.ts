import { file } from '@babel/types'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { S3 } from 'aws-sdk'
import { PrismaService } from 'src/prisma/prisma.service'
import { v4 as uuid } from 'uuid'

@Injectable()
export class FilesService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async uploadPublicFile(dataBuffer: Buffer, filename: string) {
    const s3 = new S3()
    const uploadResult = await s3
      .upload({
        Bucket: this.configService.get('S3_BUCKET'),
        Body: dataBuffer,
        Key: `${uuid()}-${filename}`,
      })
      .promise()

    return this.prisma.publicFile.create({
      data: {
        key: uploadResult.Key,
        url: uploadResult.Location,
      },
    })
  }

  async deletePublicFile(fileId: number) {
    const file = await this.prisma.publicFile.findUnique({
      where: { id: fileId },
    })
    const s3 = new S3()
    await s3
      .deleteObject({
        Bucket: this.configService.get('S3_BUCKET'),
        Key: file.key,
      })
      .promise()
    await this.prisma.publicFile.delete({ where: { id: fileId } })
  }
}
