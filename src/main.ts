import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // ignora campos que não estão no DTO
      forbidNonWhitelisted: false, // não lança erro por campos extras
      transform: true, // converte tipos automaticamente (string → number, etc)
      transformOptions: {
        enableImplicitConversion: true, // aceita número como string, boolean etc.
      },
    }),
  );

  // Libera CORS para o frontend (localhost e produção)
  app.enableCors({
    origin: [
      'http://localhost:3000', // local
      'https://bookshelf-mobr.vercel.app', // front deployado
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'], // adicione se necessário
    credentials: true, // se usar cookies/autenticação
  });

  // Garante que o Prisma feche corretamente no shutdown
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Bookshelf API')
    .setDescription(
      'API para gerenciamento de uma biblioteca pessoal de livros.',
    )
    .setVersion('1.0')
    .addTag('books', 'Operações relacionadas a livros')
    .addTag('genres', 'Operações relacionadas a gêneros')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Escuta na porta padrão (Render define PORT automaticamente)
  await app.listen(process.env.PORT || 3001);
  console.log(`Aplicação rodando em: ${await app.getUrl()}`);
}

bootstrap();
