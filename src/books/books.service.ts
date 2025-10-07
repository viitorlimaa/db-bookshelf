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

 async update(id: number, data: any) {
  const {
    title,
    author,
    year,
    pages,
    rating,
    synopsis,
    cover,
    currentPage,
    status,
    genreIds,
  } = data;

  return this.prisma.book.update({
    where: { id: Number(id) },
    data: {
      title,
      author,
      year,
      pages,
      rating,
      synopsis,
      cover,
      currentPage,
      status,
      // 🔹 Atualiza relação de gêneros corretamente
      genres: {
        set: genreIds?.map((genreId: number) => ({ id: genreId })) || [],
      },
    },
    include: { genres: true },
  });
}


  deleteBook(id: number) {
    return this.prisma.book.delete({ where: { id } });
  }
}
