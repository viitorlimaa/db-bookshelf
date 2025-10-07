import { Controller, Get, Post, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { GenresService } from './genres.service';

@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Get()
  async findAll() {
    return this.genresService.getGenres();
  }

  @Post()
  async create(@Body('name') name: string) {
    return this.genresService.createGenre(name);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.genresService.deleteGenre(id);
  }
}
