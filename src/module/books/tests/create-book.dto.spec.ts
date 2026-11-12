import { validateSync } from 'class-validator';
import { CreateBookDto } from '../dto/create-book.dto';

describe('CreateBookDto', () => {
  it('accepts only the required title and author', () => {
    const dto = Object.assign(new CreateBookDto(), {
      title: 'Clean Code',
      author: 'Robert C. Martin',
    });

    expect(validateSync(dto)).toHaveLength(0);
  });

  it('accepts zero values sent by the empty form', () => {
    const dto = Object.assign(new CreateBookDto(), {
      title: 'Clean Code',
      author: 'Robert C. Martin',
      year: 0,
      pages: 0,
      currentPage: 0,
      rating: 0,
      synopsis: 'Sem sinopse',
    });

    expect(validateSync(dto)).toHaveLength(0);
  });

  it('validates optional fields when they are present', () => {
    const dto = Object.assign(new CreateBookDto(), {
      title: 'Clean Code',
      author: 'Robert C. Martin',
      pages: -1,
      rating: 6,
      cover: 'not-a-url',
    });

    expect(validateSync(dto).map(({ property }) => property)).toEqual(
      expect.arrayContaining(['pages', 'rating', 'cover']),
    );
  });
});
