import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async getBooks() {
    return this.prisma.book.findMany({ include: { genres: true } });
  }

  async getBook(id: number) {
    return this.prisma.book.findUnique({
      where: { id },
      include: { genres: true },
    });
  }

  async createBook(data: CreateBookDto) {
    try {
      const { genreIds, ...rest } = data;

      const createData: any = {
        ...rest,
        cover: rest.cover || 'https://via.placeholder.com/150',
        synopsis: rest.synopsis || 'Sem sinopse',
      };

      if (Array.isArray(genreIds) && genreIds.length > 0) {
        const validGenres = await this.prisma.genre.findMany({
          where: { id: { in: genreIds } },
        });

        if (validGenres.length === 0) {
          throw new HttpException('Nenhum gênero válido encontrado.', HttpStatus.BAD_REQUEST);
        }

        createData.genres = {
          connect: validGenres.map((g) => ({ id: g.id })),
        };
      }

      const newBook = await this.prisma.book.create({
        data: createData,
        include: { genres: true },
      });

      console.log('✅ Livro criado:', newBook.title);
      return newBook;
    } catch (error) {
      console.error('❌ Erro ao criar livro:', error);
      throw new HttpException(
        { message: 'Erro ao criar livro', detalhe: error?.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateBook(id: number, data: UpdateBookDto) {
    try {
      const { genreIds, ...rest } = data;
      const updateData: any = {
        ...rest,
        cover: rest.cover || 'https://via.placeholder.com/150',
        synopsis: rest.synopsis || 'Sem sinopse',
      };

      // 🔹 Verifica se os gêneros existem antes de atualizar
      if (Array.isArray(genreIds) && genreIds.length > 0) {
        const validGenres = await this.prisma.genre.findMany({
          where: { id: { in: genreIds } },
        });

        if (validGenres.length === 0) {
          throw new HttpException('Nenhum gênero válido encontrado.', HttpStatus.BAD_REQUEST);
        }

        updateData.genres = {
          set: validGenres.map((g) => ({ id: g.id })),
        };
      }

      const updatedBook = await this.prisma.book.update({
        where: { id: Number(id) },
        data: updateData,
        include: { genres: true },
      });

      console.log('✅ Livro atualizado:', updatedBook.title);
      return updatedBook;
    } catch (error) {
      console.error('❌ Erro Prisma ao atualizar livro:', error);
      throw new HttpException(
        {
          message: 'Erro ao atualizar livro',
          detalhe: error?.message ?? 'Erro interno',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteBook(id: number) {
    try {
      const deleted = await this.prisma.book.delete({ where: { id: Number(id) } });
      console.log('🗑️ Livro deletado:', deleted.title);
      return deleted;
    } catch (error) {
      console.error('❌ Erro ao deletar livro:', error);
      throw new HttpException('Erro ao deletar livro', HttpStatus.BAD_REQUEST);
    }
  }
}
