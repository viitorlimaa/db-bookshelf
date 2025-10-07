import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@ApiTags('books') // Agrupa todos os endpoints sob a tag "books" na UI do Swagger
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @ApiOperation({
    summary: 'Cria um novo livro',
    description:
      'Adiciona um novo livro à coleção e o associa aos gêneros informados.',
  })
  @ApiBody({
    type: CreateBookDto,
    description: 'Dados para a criação de um novo livro.',
  })
  @ApiResponse({
    status: 201,
    description: 'O livro foi criado com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description: 'Requisição inválida. Verifique os dados enviados.',
  })
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.createBook(createBookDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os livros' })
  @ApiResponse({
    status: 200,
    description: 'Retorna uma lista de todos os livros da coleção.',
  })
  findAll() {
    return this.booksService.getBooks();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um livro específico pelo ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID único do livro.',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'Retorna os dados do livro.' })
  @ApiResponse({
    status: 404,
    description: 'O livro com o ID informado não foi encontrado.',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.getBook(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um livro existente' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID do livro a ser atualizado.',
    example: 1,
  })
  @ApiBody({
    type: UpdateBookDto,
    description:
      'Dados a serem atualizados. Apenas os campos informados serão modificados.',
  })
  @ApiResponse({
    status: 200,
    description: 'O livro foi atualizado com sucesso.',
  })
  @ApiResponse({
    status: 404,
    description: 'O livro com o ID informado não foi encontrado.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Define o status de sucesso como 204
  @ApiOperation({ summary: 'Remove um livro da coleção' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID do livro a ser removido.',
    example: 1,
  })
  @ApiResponse({
    status: 204,
    description: 'O livro foi removido com sucesso.',
  })
  @ApiResponse({
    status: 404,
    description: 'O livro com o ID informado não foi encontrado.',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.deleteBook(id);
  }
}
