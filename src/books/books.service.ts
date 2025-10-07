import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  getBooks() {
    return this.prisma.book.findMany({
      include: { genres: true },
    });
  }

  getBook(id: number) {
    return this.prisma.book.findUnique({
      where: { id },
      include: { genres: true },
    });
  }

  async createBook(data: CreateBookDto) {
    const { genreIds, ...bookData } = data;

    return this.prisma.book.create({
      data: {
        ...bookData,
        genres: genreIds
          ? { connect: genreIds.map((id) => ({ id })) }
          : undefined,
      },
      include: { genres: true },
    });
  }

  async updateBook(id: number, data: UpdateBookDto) {
    const { genreIds, ...bookData } = data;

    // Remove campos undefined (para evitar conflito com o Prisma)
    const cleanedData = Object.fromEntries(
      Object.entries(bookData).filter(([_, v]) => v !== undefined)
    );

    return this.prisma.book.update({
      where: { id },
      data: {
        ...cleanedData,
        ...(genreIds
          ? {
              genres: {
                set: genreIds.map((id) => ({ id })),
              },
            }
          : {}),
      },
      include: { genres: true },
    });
  }

 async deleteBook(id: number) {
  await this.prisma.book.delete({
    where: { id },
  });
  // não retorna nada -> força o Nest a respeitar o 204 do controller
  return;
}
}
