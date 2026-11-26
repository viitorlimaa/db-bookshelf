// prisma/seed.ts
import { PrismaClient, ReadingStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Iniciando o processo de seeding...');

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
      isbn: '9788525406798',
      cover: 'https://covers.openlibrary.org/b/id/10558903-L.jpg?default=false',
      status: 'LIDO',
      currentPage: 256,
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
      isbn: '9786586064698',
      cover: 'https://covers.openlibrary.org/b/id/15228506-L.jpg?default=false',
      status: 'LENDO',
      currentPage: 320,
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
      isbn: '9788501012074',
      cover: 'https://covers.openlibrary.org/b/id/13162734-L.jpg?default=false',
      status: 'QUERO_LER',
      currentPage: 0,
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
      isbn: '9789897773921',
      cover: 'https://covers.openlibrary.org/b/id/15120679-L.jpg?default=false',
      status: 'LENDO',
      currentPage: 200,
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
      isbn: '9789721029842',
      cover: 'https://covers.openlibrary.org/b/id/14844177-L.jpg?default=false',
      status: 'LIDO',
      currentPage: 432,
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
      isbn: '9788575421130',
      cover: 'https://covers.openlibrary.org/b/id/10578429-L.jpg?default=false',
      status: 'QUERO_LER',
      currentPage: 0,
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
      isbn: '9788560280940',
      cover: 'https://covers.openlibrary.org/b/id/14563910-L.jpg?default=false',
      status: 'LENDO',
      currentPage: 400,
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
      isbn: '9788535919714',
      cover: 'https://covers.openlibrary.org/b/id/12374726-L.jpg?default=false',
      status: 'LIDO',
      currentPage: 656,
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
      isbn: '9788535933925',
      cover: 'https://covers.openlibrary.org/b/id/14540965-L.jpg?default=false',
      status: 'QUERO_LER',
      currentPage: 0,
      genre: 'História',
    },
    {
      title: 'Código Limpo',
      author: 'Robert C. Martin',
      year: 2008,
      pages: 464,
      rating: 4.9,
      synopsis:
        'Um guia essencial para escrever código legível, eficiente e sustentável.',
      isbn: '9788576082675',
      cover: 'https://covers.openlibrary.org/b/id/12004890-L.jpg?default=false',
      status: 'LIDO',
      currentPage: 464,
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
      isbn: '9788539004256',
      cover: 'https://covers.openlibrary.org/b/id/14621911-L.jpg?default=false',
      status: 'LENDO',
      currentPage: 200,
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
      isbn: '9786587885339',
      cover: 'https://covers.openlibrary.org/b/id/13264786-L.jpg?default=false',
      status: 'QUERO_LER',
      currentPage: 0,
      genre: 'Filosofia',
    },
  ];

  if ((await prisma.book.count()) === 0) {
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
          isbn: book.isbn,
          cover: book.cover,
          currentPage: book.currentPage,
          status: book.status as ReadingStatus,
          genres: { connect: [{ id: genre.id }] },
        },
      });
    }

    console.log(`✅ ${books.length} livros inseridos com capas reais.`);
  } else {
    let updatedBooks = 0;

    for (const book of books) {
      const titleAliases =
        book.title === 'Código Limpo'
          ? ['Código Limpo', 'Coder Propement']
          : [book.title];
      const existingBook = await prisma.book.findFirst({
        where: {
          author: book.author,
          title: { in: titleAliases },
        },
      });

      if (!existingBook) continue;

      await prisma.book.update({
        where: { id: existingBook.id },
        data: {
          title: book.title,
          isbn: book.isbn,
          cover: book.cover,
        },
      });
      updatedBooks += 1;
    }

    console.log(
      `✅ ${updatedBooks} livros do seed atualizados; outros registros preservados.`,
    );
  }
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
