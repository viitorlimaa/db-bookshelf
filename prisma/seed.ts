import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

const FIXED_GENRES = [
  'Literatura Brasileira',
  'Ficção Científica',
  'Realismo Mágico',
  'Ficção',
  'Fantasia',
  'Romance',
  'Biografia',
  'História',
  'Autoajuda',
  'Tecnologia',
  'Programação',
  'Negócios',
  'Psicologia',
  'Filosofia',
  'Poesia',
  'Mistério',
];

async function main() {
  console.log('Iniciando o processo de seeding...');

  // Limpar tabelas
  await prisma.book.deleteMany({});
  await prisma.genre.deleteMany({});
  console.log('Tabelas limpas com sucesso.');

  // Popular gêneros fixos
  for (const name of FIXED_GENRES) {
    await prisma.genre.create({
      data: { name },
    });
  }
  console.log('✅ Gêneros fixos populados com sucesso!');

  // Carregar dados antigos
  const filePath = path.join(process.cwd(), 'prisma', 'books-DEPRECATED.json');
  if (!fs.existsSync(filePath)) {
    console.warn(`Arquivo não encontrado: ${filePath}`);
    return;
  }

  const oldBooksData = fs.readFileSync(filePath, 'utf-8');
  const oldBooks = JSON.parse(oldBooksData);

  console.log(`Carregando dados a partir de: ${filePath}`);

  for (const book of oldBooks) {
    console.log(`Processando o livro: ${book.title}`);

    // Garantir que seja array de gêneros
    const genresArray = Array.isArray(book.genres) ? book.genres : [book.genre];

    await prisma.book.create({
      data: {
        title: book.title,
        author: book.author,
        year: book.year || 0,
        pages: book.pages || 0,
        rating: book.rating || 0,
        synopsis: book.synopsis || 'Sem sinopse',
        cover: book.cover || 'https://via.placeholder.com/150',
        currentPage: 0,
        status: 'QUERO_LER',
        genres: {
          connectOrCreate: genresArray.map((g: string) => ({
            where: { name: g }, // precisa ser UNIQUE no schema
            create: { name: g },
          })),
        },
      },
    });
  }

  console.log('✅ Seeding de livros finalizado com sucesso!');
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
