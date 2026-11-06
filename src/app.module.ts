import { Module } from '@nestjs/common';
import { GenresModule } from './module/genres/genres.module';
import { BooksModule } from './module/books/books.module';
import { HealthModule } from './module/health/health.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [GenresModule, PrismaModule, BooksModule, HealthModule],
})
export class AppModule {}
