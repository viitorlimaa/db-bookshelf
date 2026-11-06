import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../prisma/prisma.service';
import { BooksService } from '../books.service';

describe('BooksService', () => {
  let service: BooksService;
  const prisma = {
    book: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  it('should query books with their genres', async () => {
    const books = [{ id: 1, title: 'Clean Code', genres: [] }];
    prisma.book.findMany.mockResolvedValue(books);

    await expect(service.getBooks()).resolves.toBe(books);
    expect(prisma.book.findMany).toHaveBeenCalledWith({
      include: { genres: true },
    });
  });
});
