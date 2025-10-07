import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o processo de seeding...');

  await prisma.book.deleteMany({});
  await prisma.genre.deleteMany({});
  console.log('Tabelas limpas com sucesso.');

  const filePath = path.join(process.cwd(), 'prisma', 'books-DEPRECATED.json');
  const oldBooksData = fs.readFileSync(filePath);
  const oldBooks = JSON.parse(oldBooksData.toString());

  console.log(`Carregando dados a partir de: ${filePath}`);

  for (const book of oldBooks) {
    console.log(`Processando o livro: ${book.title}`);

    // Garantir que seja array de gêneros
    const genresArray = Array.isArray(book.genres) ? book.genres : [book.genre];

    await prisma.book.create({
      data: {
        title: book.title,
        author: book.author,
        year: book.year,
        pages: book.pages,
        rating: book.rating,
        synopsis: book.synopsis,
        cover: book.cover,
        currentPage: 0,
        status: 'QUERO_LER',
        genres: {
          connectOrCreate: genresArray.map((g: string) => ({
            where: { name: g },
            create: { name: g },
          })),
        },
      },
    });
  }

  console.log('✅ Seeding finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    console.log('Desconectando do Prisma...');
    await prisma.$disconnect();
  });
