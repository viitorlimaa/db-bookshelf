import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { configureApp } from './configure-app';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureApp(app);

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
