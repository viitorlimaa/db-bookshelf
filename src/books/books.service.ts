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

 async createBook(data: CreateBookDto) {
  const { genreIds, ...rest } = data;
  return this.prisma.book.create({
    data: {
      ...rest,
      genres: genreIds ? { connect: genreIds.map((id) => ({ id })) } : undefined,
    },
    include: { genres: true },
  });
}


 async updateBook(id: number, data: UpdateBookDto) {
  const { genreIds, ...rest } = data;
  const updateData: any = { ...rest };

  if (genreIds) {
    updateData.genres = { set: genreIds.map((id) => ({ id })) };
  }

  return this.prisma.book.update({
    where: { id },
    data: updateData,
    include: { genres: true },
  });
}

  deleteBook(id: number) {
    return this.prisma.book.delete({ where: { id } });
  }
}
