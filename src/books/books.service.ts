import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  getBooks() {
    return this.prisma.book.findMany({ include: { genres: true } });
  }

  getBook(id: number) {
    return this.prisma.book.findUnique({
      where: { id },
      include: { genres: true },
    });
  }

  createBook(data: CreateBookDto) {
    return this.prisma.book.create({ data });
  }

async updateBook(id: number, data: UpdateBookDto) {
  return this.prisma.book.update({
    where: { id },
    data: {
      ...data,
      genres: data.genreIds
        ? {
            set: data.genreIds.map((id) => ({ id })),
          }
        : undefined,
    },
    include: { genres: true },
  });
}




  deleteBook(id: number) {
    return this.prisma.book.delete({ where: { id } });
  }
}
