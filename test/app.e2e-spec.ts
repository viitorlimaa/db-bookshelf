import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { configureApp } from './../src/configure-app';

describe('API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /health returns 200', async () => {
    await request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect(({ body }) => {
        expect(body.status).toBe('ok');
      });
  });

  it('POST /books creates a book with title and author', async () => {
    await request(app.getHttpServer())
      .post('/books')
      .send({ title: 'E2E book', author: 'E2E author' })
      .expect(201)
      .expect(({ body }) => {
        expect(body.title).toBe('E2E book');
        expect(body.author).toBe('E2E author');
      });
  });

  it('POST /books without a title returns 400', async () => {
    await request(app.getHttpServer())
      .post('/books')
      .send({ author: 'E2E author' })
      .expect(400);
  });

  it('GET /books includes a newly created book', async () => {
    const created = await request(app.getHttpServer())
      .post('/books')
      .send({ title: 'Listed book', author: 'List author' })
      .expect(201);

    const response = await request(app.getHttpServer())
      .get('/books')
      .expect(200);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: created.body.id, title: 'Listed book' }),
      ]),
    );
  });

  it('GET /books/:id returns an existing book and 404 for a missing one', async () => {
    const created = await request(app.getHttpServer())
      .post('/books')
      .send({ title: 'Detail book', author: 'Detail author' })
      .expect(201);

    await request(app.getHttpServer())
      .get(`/books/${created.body.id}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.title).toBe('Detail book');
      });

    await request(app.getHttpServer()).get('/books/999999999').expect(404);
  });

  it('PATCH /books/:id updates isbn and notes', async () => {
    const created = await request(app.getHttpServer())
      .post('/books')
      .send({ title: 'Updated book', author: 'Update author' })
      .expect(201);

    await request(app.getHttpServer())
      .patch(`/books/${created.body.id}`)
      .send({ isbn: '9780000000001', notes: 'E2E notes' })
      .expect(200)
      .expect(({ body }) => {
        expect(body.isbn).toBe('9780000000001');
        expect(body.notes).toBe('E2E notes');
      });
  });

  it('DELETE /books/:id returns 204 and the book is then unavailable', async () => {
    const created = await request(app.getHttpServer())
      .post('/books')
      .send({ title: 'Deleted book', author: 'Delete author' })
      .expect(201);

    await request(app.getHttpServer())
      .delete(`/books/${created.body.id}`)
      .expect(204);

    await request(app.getHttpServer())
      .get(`/books/${created.body.id}`)
      .expect(404);
  });
});
