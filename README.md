# Projeto Bookshelf - API 📚

## Visão Geral

Este repositório contém o backend da aplicação **Bookshelf**, uma API RESTful robusta construída com **NestJS** e **Prisma**. O projeto serve como uma plataforma para gerenciar uma coleção pessoal de livros, rastrear o progresso de leitura e organizar títulos por gênero.

A arquitetura foi migrada de um sistema de armazenamento baseado em arquivos JSON para um banco de dados **SQLite**, proporcionando maior performance, integridade de dados, escalabilidade e segurança de tipos (type-safety) de ponta a ponta.

### Principais Funcionalidades

- **Gerenciamento de Livros (CRUD):** Operações completas para criar, ler, atualizar e deletar livros.
- **Modelo de Dados Expandido:** Rastreamento de status de leitura, progresso, anotações, ISBN e mais.
- **Gerenciamento de Gêneros:** Sistema dinâmico para adicionar e consultar categorias de livros.
- **Banco de Dados Relacional:** Uso do Prisma ORM para garantir relacionamentos e integridade dos dados.
- **Validação de Dados:** Uso de DTOs (Data Transfer Objects) e `class-validator` para garantir que apenas dados válidos cheguem ao banco.

---

## Arquitetura e Tecnologias

- **Framework:** [NestJS](https://nestjs.com/)
- **ORM (Object-Relational Mapping):** [Prisma](https://www.prisma.io/)
- **Banco de Dados:** [SQLite](https://www.sqlite.org/index.html)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Validação:** `class-validator` & `class-transformer`

---

## Estrutura do Banco de Dados (`schema.prisma`)

O schema do Prisma define os modelos, relacionamentos e o enum para o status de leitura.

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

enum ReadingStatus {
  QUERO_LER
  LENDO
  LIDO
  PAUSADO
  ABANDONADO
}

model Book {
  id          Int      @id @default(autoincrement())
  title       String
  author      String
  year        Int
  pages       Int
  rating      Float
  synopsis    String
  cover       String

  // Campos de rastreamento
  status      ReadingStatus @default(QUERO_LER)
  currentPage Int
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  // Campos opcionais
  isbn        String?
  notes       String?

  // Relacionamento Muitos-para-Muitos com Gêneros
  genres      Genre[]
}

model Genre {
  id    Int    @id @default(autoincrement())
  name  String @unique

  // Relacionamento com Livros
  books Book[]
}
```

````

---

## 🚀 Guia de Instalação e Configuração

Siga os passos abaixo para configurar e executar o ambiente de desenvolvimento local.

### 1\. Pré-requisitos

- Node.js (v18 ou superior)
- npm ou Yarn

### 2\. Clonar e Instalar

```bash
# Clone o repositório
git clone <URL_DO_SEU_REPOSITORIO>
cd bookshelf-backend

# Instale as dependências
npm install
```

### 3\. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto e adicione a URL do banco de dados.

```env
# .env
DATABASE_URL="file:./prisma/dev.db"
```

### 4\. Migração do Banco de Dados

Este comando cria o arquivo do banco de dados SQLite e executa as migrações para criar as tabelas.

```bash
npm run prisma:migrate
```

### 5\. (Opcional) Popular o Banco com Dados Iniciais

Para migrar os dados do antigo arquivo `books-DEPRECATED.json` para o banco, execute o script de seed.

```bash
npm run prisma:seed
```

### 6\. Iniciar a Aplicação

Execute o servidor em modo de desenvolvimento. Ele reiniciará automaticamente a cada alteração de código.

```bash
npm run start:dev
```

A API estará disponível em `http://localhost:3000`.

---

## 🛠️ Scripts Disponíveis

- `npm run start:dev`: Inicia a aplicação em modo de desenvolvimento.
- `npm run build`: Compila o projeto para produção (gera a pasta `dist`).
- `npm run start:prod`: Inicia a aplicação em modo de produção (a partir da pasta `dist`).
- `npm run prisma:migrate`: Aplica novas migrações ao banco de dados.
- `npm run prisma:seed`: Executa o script para popular o banco com dados iniciais.
- `npm run db:reset`: Apaga e recria o banco de dados a partir das migrações (útil para desenvolvimento).

---

## 🌐 Endpoints da API

### Recurso: Livros (`/books`)

| Método   | Rota   | Descrição                    | Corpo (Body)    |
| :------- | :----- | :--------------------------- | :-------------- |
| `POST`   | `/`    | Cria um novo livro.          | `CreateBookDto` |
| `GET`    | `/`    | Lista todos os livros.       | N/A             |
| `GET`    | `/:id` | Busca um livro pelo ID.      | N/A             |
| `PATCH`  | `/:id` | Atualiza um livro existente. | `UpdateBookDto` |
| `DELETE` | `/:id` | Remove um livro.             | N/A             |

### Recurso: Gêneros (`/genres`)

| Método | Rota | Descrição               | Corpo (Body)        |
| :----- | :--- | :---------------------- | :------------------ |
| `POST` | `/`  | Cria um novo gênero.    | `{ "name": "..." }` |
| `GET`  | `/`  | Lista todos os gêneros. | N/A                 |

---

## ☁️ Considerações sobre Deploy

Para fazer o deploy desta aplicação em plataformas como [Render](https://render.com/), é crucial lidar com a natureza baseada em arquivo do SQLite.

- **Disco Persistente:** É **obrigatório** configurar um disco persistente para armazenar o arquivo do banco de dados. O sistema de arquivos padrão de serviços de nuvem é efêmero e será apagado a cada deploy.
  - **Mount Path Sugerido:** `/data`
- **Variável de Ambiente de Produção:** A `DATABASE_URL` deve apontar para o disco persistente.
  - `DATABASE_URL="file:/data/bookshelf.db"`
- **Comando de Build:** O processo de build deve incluir a execução das migrações.
  - `npm install && npx prisma migrate deploy && npm run build`
- **Comando de Start:** Execute a versão de produção.
  - `npm run start:prod`

---

## 📄 Licença

Este projeto está sob a licença UNLICENSED.
````
