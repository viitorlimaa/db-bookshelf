# Projeto Bookshelf - API 📚

## Visão Geral

Este repositório contém o backend da aplicação **Bookshelf**, uma API RESTful robusta construída com **NestJS** e **Prisma**. O projeto serve como uma plataforma para gerenciar uma coleção pessoal de livros, rastrear o progresso de leitura e organizar títulos por gênero.

A arquitetura usa PostgreSQL para persistência gerenciada, integridade de dados, escalabilidade e segurança de tipos (type-safety) de ponta a ponta.

### Principais Funcionalidades

- **Gerenciamento de Livros (CRUD):** Operações completas para criar, ler, atualizar e deletar livros.
- **Modelo de Dados Expandido:** Rastreamento de status de leitura, progresso, anotações, ISBN e mais.
- **Gerenciamento de Gêneros:** Sistema dinâmico para adicionar e consultar categorias de livros.
- **Banco de Dados Relacional:** Uso do Prisma ORM para garantir relacionamentos e integridade dos dados.
- **Validação de Dados:** Uso de DTOs (Data Transfer Objects) e `class-validator` para garantir que apenas dados válidos cheguem ao banco.

---
🌐 **Deploy:** [db-bookshelf.onrender.com](https://db-bookshelf.onrender.com)
---

## Arquitetura e Tecnologias

- **Framework:** [NestJS](https://nestjs.com/)
- **ORM (Object-Relational Mapping):** [Prisma](https://www.prisma.io/)
- **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/)
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
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_DATABASE_URL")
}

// 1.6: Status de Leitura como Enum
enum ReadingStatus {
  QUERO_LER
  LENDO
  LIDO
  PAUSADO
  ABANDONADO
}

// 1.4: Modelo de Livro Expandido
model Book {
  id          Int       @id @default(autoincrement())
  title       String
  author      String?
  year        Int?
  pages       Int?
  cover       String?
  synopsis    String?
  currentPage Int?       @default(0)
  rating      Float?     @default(0)   
  status      ReadingStatus @default(QUERO_LER)
  isbn        String?
  notes       String?
  genres      Genre[]
}


// 1.5: Modelo de Gêneros
model Genre {
  id   Int    @id @default(autoincrement())
  name String @unique

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
# PostgreSQL local
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bookshelf"
DIRECT_DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bookshelf"
```

### 4\. Migração do Banco de Dados

Este comando aplica as migrações PostgreSQL e cria as tabelas no banco configurado.

```bash
npx prisma migrate dev
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
- `npx prisma migrate dev`: Cria e aplica migrações no ambiente de desenvolvimento.
- `npm run prisma:seed`: Executa o script para popular o banco com dados iniciais.

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
| `GET`  | `/`  | Lista todos os gêneros. | N/A                 |

---

## ☁️ Considerações sobre Deploy

Para fazer o deploy desta aplicação no Render, use uma URL PostgreSQL gerenciada.

- **Variável de Ambiente de Produção:** Configure `DATABASE_URL` com a URL do banco gerenciado.
- Use `DIRECT_DATABASE_URL` com a conexão direta do provedor quando `DATABASE_URL` usa um pooler.
- **Comando de Build:** O processo de build deve incluir a execução das migrações.
  - `npm install && npx prisma migrate deploy && npm run build && npm run prisma:seed`
- **Comando de Start:** Execute a versão de produção.
  - `npm run start:prod`

---

## 📄 Licença

Este projeto está sob a licença UNLICENSED.
````
