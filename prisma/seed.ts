// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Iniciando o processo de seeding...');

  await prisma.book.deleteMany({});
  await prisma.genre.deleteMany({});
  console.log('🧹 Tabelas limpas.');

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

  console.log(`✅ ${genres.length} gêneros criados.`);

  // ===============================
  // 2️⃣ Livros com URLs válidas
  // ===============================
  const books = [
    {
      title: 'Dom Casmurro',
      author: 'Machado de Assis',
      year: 1899,
      pages: 256,
      rating: 4.8,
      synopsis:
        'Um clássico da literatura brasileira que explora ciúme, memória e ambiguidade na narrativa de Bentinho.',
      cover: 'https://covers.openlibrary.org/b/id/8228691-L.jpg',
      genre: 'Literatura Brasileira',
    },
    {
      title: 'Duna',
      author: 'Frank Herbert',
      year: 1965,
      pages: 688,
      rating: 4.7,
      synopsis:
        'Em um futuro distante, o planeta desértico Arrakis é o centro de uma luta política e espiritual pelo controle da especiaria mais valiosa do universo.',
      cover: 'https://covers.openlibrary.org/b/id/8101356-L.jpg',
      genre: 'Ficção Científica',
    },
    {
      title: 'Cem Anos de Solidão',
      author: 'Gabriel García Márquez',
      year: 1967,
      pages: 432,
      rating: 4.9,
      synopsis:
        'A saga da família Buendía na mítica cidade de Macondo, em uma obra-prima do realismo mágico.',
      cover: 'https://covers.openlibrary.org/b/id/8377226-L.jpg',
      genre: 'Realismo Mágico',
    },
    {
      title: 'O Senhor dos Anéis: A Sociedade do Anel',
      author: 'J.R.R. Tolkien',
      year: 1954,
      pages: 576,
      rating: 4.9,
      synopsis:
        'A jornada de Frodo Bolseiro para destruir o Um Anel e salvar a Terra Média da sombra de Sauron.',
      cover: 'https://covers.openlibrary.org/b/id/8231856-L.jpg',
      genre: 'Fantasia',
    },
    {
      title: 'Orgulho e Preconceito',
      author: 'Jane Austen',
      year: 1813,
      pages: 432,
      rating: 4.7,
      synopsis:
        'Elizabeth Bennet navega entre convenções sociais e o amor inesperado de Mr. Darcy.',
      cover: 'https://covers.openlibrary.org/b/id/8091016-L.jpg',
      genre: 'Romance',
    },
    {
      title: 'O Código Da Vinci',
      author: 'Dan Brown',
      year: 2003,
      pages: 480,
      rating: 4.4,
      synopsis:
        'Um thriller repleto de simbologia, segredos religiosos e uma caça a uma verdade milenar.',
      cover: 'https://covers.openlibrary.org/b/id/240726-L.jpg',
      genre: 'Mistério',
    },
    {
      title: 'It: A Coisa',
      author: 'Stephen King',
      year: 1986,
      pages: 1104,
      rating: 4.6,
      synopsis:
        'Uma entidade maléfica aterroriza a cidade de Derry, ressurgindo a cada 27 anos.',
      cover: 'https://covers.openlibrary.org/b/id/7884866-L.jpg',
      genre: 'Terror',
    },
    {
      title: 'Steve Jobs',
      author: 'Walter Isaacson',
      year: 2011,
      pages: 656,
      rating: 4.5,
      synopsis:
        'A biografia definitiva do cofundador da Apple, baseada em entrevistas e acesso direto ao próprio Jobs.',
      cover: 'https://covers.openlibrary.org/b/id/7270135-L.jpg',
      genre: 'Biografia',
    },
    {
      title: 'Sapiens: Uma Breve História da Humanidade',
      author: 'Yuval Noah Harari',
      year: 2011,
      pages: 512,
      rating: 4.8,
      synopsis:
        'Uma análise profunda da evolução da humanidade, das tribos caçadoras às sociedades tecnológicas.',
      cover: 'https://covers.openlibrary.org/b/id/8371261-L.jpg',
      genre: 'História',
    },
    {
      title: 'Clean Code',
      author: 'Robert C. Martin',
      year: 2008,
      pages: 464,
      rating: 4.9,
      synopsis:
        'Um guia essencial para escrever código legível, eficiente e sustentável.',
      cover: 'https://covers.openlibrary.org/b/id/9641987-L.jpg',
      genre: 'Programação',
    },
    {
      title: 'O Poder do Hábito',
      author: 'Charles Duhigg',
      year: 2012,
      pages: 408,
      rating: 4.5,
      synopsis:
        'Explora como hábitos moldam o comportamento humano e como transformá-los.',
      cover: 'https://covers.openlibrary.org/b/id/8179872-L.jpg',
      genre: 'Psicologia',
    },
    {
      title: 'Meditações',
      author: 'Marco Aurélio',
      year: 180,
      pages: 256,
      rating: 4.8,
      synopsis:
        'Reflexões pessoais do imperador romano sobre virtude, razão e a natureza do universo.',
      cover: 'https://covers.openlibrary.org/b/id/8231998-L.jpg',
      genre: 'Filosofia',
    },
  ];

  for (const book of books) {
    const genre = await prisma.genre.findUnique({
      where: { name: book.genre },
    });

    if (!genre) continue;

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
        genres: { connect: [{ id: genre.id }] },
      },
    });
  }

  console.log(`✅ ${books.length} livros inseridos com capas reais.`);
}

main()
  .catch((e) => {
    console.error('❌ Erro no seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('🔌 Desconectado do Prisma.');
  });
