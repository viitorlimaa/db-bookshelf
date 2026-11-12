import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
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

  async getBook(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: { genres: true },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return book;
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
      Object.entries(bookData).filter(([_, v]) => v !== undefined),
    );

    try {
      return await this.prisma.book.update({
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
    } catch (error) {
      this.throwNotFoundIfPrismaRecordIsMissing(error);
    }
  }

  async deleteBook(id: number) {
    try {
      await this.prisma.book.delete({
        where: { id },
      });
    } catch (error) {
      this.throwNotFoundIfPrismaRecordIsMissing(error);
    }
    // não retorna nada -> força o Nest a respeitar o 204 do controller
    return;
  }

  private throwNotFoundIfPrismaRecordIsMissing(error: unknown): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw new NotFoundException('Book not found');
    }

    throw error;
  }
}
