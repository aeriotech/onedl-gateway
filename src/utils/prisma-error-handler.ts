import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export default function handlePrismaError(error: Error, field: String = '') {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2025':
        throw new NotFoundException(`${field} Not Found`.trim());
    }
  }
}
