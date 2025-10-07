import { Module } from '@nestjs/common';
import { BooksModule } from './books/books.module';
import { PrismaModule } from './prisma/prisma.module';
import { GenresModule } from './genres/genres.module';

@Module({
  imports: [GenresModule, PrismaModule, BooksModule],
  
})
export class AppModule {}
