import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { BooksService } from '../books.service';

function prismaRecordNotFoundError() {
  return new Prisma.PrismaClientKnownRequestError(
    'Record to update or delete does not exist.',
    { code: 'P2025', clientVersion: 'test' },
  );
}

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

  it('should throw NotFoundException when a book does not exist', async () => {
    prisma.book.findUnique.mockResolvedValue(null);

    await expect(service.getBook(99999)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('should throw NotFoundException when updating a missing book', async () => {
    prisma.book.update.mockRejectedValue(prismaRecordNotFoundError());

    await expect(service.updateBook(99999, {})).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('should throw NotFoundException when deleting a missing book', async () => {
    prisma.book.delete.mockRejectedValue(prismaRecordNotFoundError());

    await expect(service.deleteBook(99999)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('should rethrow Prisma errors other than P2025', async () => {
    const error = new Prisma.PrismaClientKnownRequestError('Database error', {
      code: 'P2002',
      clientVersion: 'test',
    });
    prisma.book.delete.mockRejectedValue(error);

    await expect(service.deleteBook(1)).rejects.toBe(error);
  });
});
