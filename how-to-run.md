# Bookshelf API 📚

Uma API RESTful robusta, construída com [NestJS](https://nestjs.com/) e [Prisma](https://www.prisma.io/), para gerenciar uma coleção pessoal de livros. Este backend oferece operações CRUD completas, validação de dados e uma arquitetura moderna e escalável.

## Visão Geral da Arquitetura

Este projeto utiliza uma arquitetura modular comum em aplicações NestJS, separando as responsabilidades em Módulos, Controladores e Serviços. O Prisma ORM é usado como a camada de acesso a dados, comunicando-se com um banco de dados SQLite para persistência.

- **Framework**: NestJS v11
- **ORM**: Prisma v5
- **Banco de Dados**: SQLite
- **Linguagem**: TypeScript v5
- **Validação**: `class-validator` e DTOs (Data Transfer Objects)

---

## Pré-requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas em sua máquina:

- [Node.js](https://nodejs.org/) (versão 20.x ou superior recomendada)
- [npm](https://www.npmjs.com/) (geralmente instalado com o Node.js)
- [Git](https://git-scm.com/)

---

## 🚀 Instalação e Configuração Inicial

Siga os passos abaixo para configurar e rodar o projeto localmente.

### 1\. Clonar o Repositório

```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd bookshelf-backend
```

### 2\. Instalar Dependências

Este comando instalará todos os pacotes necessários do `package.json`. Ele também executará o script `postinstall`, que roda `prisma generate` automaticamente para criar o Prisma Client.

```bash
npm install
```

### 3\. Configurar Variáveis de Ambiente

Crie um arquivo chamado `.env` na raiz do projeto. Este arquivo guardará a string de conexão do banco de dados.

```bash
touch .env
```

Adicione o seguinte conteúdo ao arquivo `.env`:

```env
# URL de conexão para o banco de dados SQLite
# O arquivo dev.db será criado dentro da pasta /prisma
DATABASE_URL="file:./prisma/dev.db"
```

### 4\. Executar a Migração do Banco de Dados

Este é um passo crucial. O comando abaixo irá ler o `schema.prisma`, criar o arquivo de banco de dados `dev.db` e gerar as tabelas (`Book`, `Genre`, etc.).

```bash
npm run prisma:migrate
```

Ao ser executado pela primeira vez, ele pedirá um nome para a migração (ex: "init").

### 5\. (Opcional) Popular o Banco com Dados Iniciais

Para preencher o banco com dados de exemplo a partir do arquivo `books-DEPRECATED.json`, execute o script de seed:

```bash
npm run prisma:seed
```

---

## 🛠️ Executando a Aplicação

### Modo de Desenvolvimento

Para iniciar o servidor em modo de desenvolvimento com hot-reload (reinicia automaticamente a cada alteração de código):

```bash
npm run start:dev
```

A aplicação estará disponível em `http://localhost:3000`.

### Modo de Produção

Para construir e iniciar a versão otimizada para produção:

```bash
# 1. Construir o projeto (compila TS para JS na pasta /dist)
npm run build

# 2. Iniciar o servidor de produção
npm run start:prod
```

---

## 🗃️ Gerenciamento do Banco de Dados (Prisma Workflow)

Todos os comandos de gerenciamento do banco foram adicionados como scripts no `package.json` para facilitar o uso.

- **Aplicar mudanças no schema:** Sempre que você alterar os modelos no arquivo `prisma/schema.prisma`, rode:

  ```bash
  npm run prisma:migrate
  ```

- **Popular o banco:** Para executar o script `prisma/seed.ts` e popular o banco com dados iniciais:

  ```bash
  npm run prisma:seed
  ```

- **Resetar o banco:** Para **apagar completamente** o banco de dados, aplicar todas as migrações novamente e deixá-lo limpo (ótimo para desenvolvimento):

  ```bash
  npm run db:reset
  ```

- **Gerar o Prisma Client manualmente:** Geralmente não é necessário devido ao hook `postinstall`, mas pode ser útil:

  ```bash
  npm run prisma:generate
  ```

---

## 🌐 Endpoints da API

A API segue os padrões RESTful para o recurso de livros.

| Método HTTP | Rota         | Descrição                                         | Corpo da Requisição (Body) |
| :---------- | :----------- | :------------------------------------------------ | :------------------------- |
| `POST`      | `/books`     | Cria um novo livro.                               | `CreateBookDto`            |
| `GET`       | `/books`     | Lista todos os livros cadastrados.                | N/A                        |
| `GET`       | `/books/:id` | Busca um livro específico pelo seu ID.            | N/A                        |
| `PATCH`     | `/books/:id` | Atualiza um ou mais campos de um livro existente. | `UpdateBookDto`            |
| `DELETE`    | `/books/:id` | Remove um livro do banco de dados.                | N/A                        |

---

## ☁️ Deploy (Exemplo: Render.com)

Para fazer o deploy desta aplicação em uma plataforma como o Render, siga estas configurações:

1.  **Tipo de Serviço:** Web Service (com ambiente nativo Node).
2.  **Comando de Build:**

    ```bash
    npm install && npx prisma migrate deploy && npm run build
    ```

    - O comando `prisma migrate deploy` é a versão segura para produção que apenas aplica migrações existentes.

3.  **Comando de Start:**
    ```bash
    npm run start:prod
    ```
4.  **Disco Persistente (Obrigatório para SQLite):**
    - Crie um disco persistente com um **Mount Path** de `/data`.
5.  **Variáveis de Ambiente:**
    - Configure a variável `DATABASE_URL` com o valor `file:/data/bookshelf.db` para garantir que o banco seja salvo no disco persistente.
