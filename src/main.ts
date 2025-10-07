import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

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

  await app.listen(3000);
  console.log(`🚀 Aplicação rodando em: ${await app.getUrl()}`);
}

bootstrap();
