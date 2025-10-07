// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Iniciando o processo de seeding...');

  // Limpa tabelas antes de popular
  await prisma.book.deleteMany({});
  await prisma.genre.deleteMany({});
  console.log('🧹 Tabelas limpas com sucesso.');

  // ===============================
  // 1️⃣ Gêneros fixos
  // ===============================
  const genres = [
    'Literatura Brasileira',
    'Ficção Científica',
    'Realismo Mágico',
    'Fantasia',
    'Romance',
    'Mistério',
    'Terror',
    'Aventura',
    'Biografia',
    'História',
    'Autoajuda',
    'Tecnologia',
    'Programação',
    'Negócios',
    'Psicologia',
    'Filosofia',
    'Poesia',
  ];

  for (const name of genres) {
    await prisma.genre.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log(`✅ ${genres.length} gêneros fixos inseridos com sucesso!`);

  // ===============================
  // 2️⃣ Livros antigos (se existirem)
  // ===============================
  const filePath = path.join(process.cwd(), 'prisma', 'books-DEPRECATED.json');

  if (!fs.existsSync(filePath)) {
    console.log('⚠️ Nenhum arquivo books-DEPRECATED.json encontrado. Pulando importação de livros.');
    return;
  }

  const oldBooksData = fs.readFileSync(filePath, 'utf8');
  const oldBooks = JSON.parse(oldBooksData);

  console.log(`📚 Importando ${oldBooks.length} livros do arquivo ${filePath}...`);

  for (const book of oldBooks) {
    console.log(`→ Processando: ${book.title}`);

    // Localiza ou cria o gênero correspondente
    const genreName = book.genre?.trim() || 'Sem Gênero';
    const genre = await prisma.genre.upsert({
      where: { name: genreName },
      update: {},
      create: { name: genreName },
    });

    await prisma.book.create({
      data: {
        title: book.title,
        author: book.author,
        year: book.year || 0,
        pages: book.pages || 0,
        rating: book.rating || 0,
        synopsis: book.synopsis || 'Sem sinopse disponível',
        cover: book.cover || 'https://via.placeholder.com/150',
        currentPage: book.currentPage || 0,
        status: 'QUERO_LER',
        genres: {
          connect: [{ id: genre.id }],
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
    console.log('🔌 Desconectando do Prisma...');
    await prisma.$disconnect();
  });
