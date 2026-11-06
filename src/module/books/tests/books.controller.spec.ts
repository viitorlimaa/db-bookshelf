import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from '../books.controller';
import { BooksService } from '../books.service';

describe('BooksController', () => {
  let controller: BooksController;
  const booksService = {
    createBook: jest.fn(),
    getBooks: jest.fn(),
    getBook: jest.fn(),
    updateBook: jest.fn(),
    deleteBook: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [{ provide: BooksService, useValue: booksService }],
    }).compile();

    controller = module.get<BooksController>(BooksController);
  });

  it('should return the books from the service', async () => {
    const books = [{ id: 1, title: 'Clean Code' }];
    booksService.getBooks.mockResolvedValue(books);

    await expect(controller.findAll()).resolves.toBe(books);
    expect(booksService.getBooks).toHaveBeenCalledTimes(1);
  });
});
