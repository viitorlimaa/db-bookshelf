import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GenresService {
  constructor(private prisma: PrismaService) {}

  // Lista todos os gêneros
  async getGenres() {
    return this.prisma.genre.findMany({ orderBy: { name: 'asc' } });
  }

  // Cria um novo gênero
  async createGenre(name: string) {
    if (!name?.trim()) {
      throw new HttpException('Nome do gênero é obrigatório', HttpStatus.BAD_REQUEST);
    }

    const exists = await this.prisma.genre.findUnique({ where: { name } });
    if (exists) {
      throw new HttpException('Gênero já existe', HttpStatus.BAD_REQUEST);
    }

    return this.prisma.genre.create({ data: { name } });
  }

  // Remove um gênero
  async deleteGenre(id: number) {
    try {
      return this.prisma.genre.delete({ where: { id } });
    } catch (err) {
      throw new HttpException('Gênero não encontrado', HttpStatus.NOT_FOUND);
    }
  }
}
