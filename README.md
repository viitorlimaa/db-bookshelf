# Bookshelf API

API REST para cadastro e organização de uma biblioteca pessoal. [Deploy](https://db-bookshelf.onrender.com) · [Swagger](https://db-bookshelf.onrender.com/api) · [Repositório do front](https://github.com/viitorlimaa/bookshelf)

## Stack

NestJS | TypeScript | Prisma | PostgreSQL | Jest | Render

## Endpoints

| Método | Rota | Descrição | Status |
| --- | --- | --- | --- |
| `POST` | `/books` | Cria um livro e associa gêneros opcionais. | `201` |
| `GET` | `/books` | Lista os livros e seus gêneros. | `200` |
| `GET` | `/books/:id` | Busca um livro pelo ID inteiro. | `200`, `404` |
| `PATCH` | `/books/:id` | Atualiza os campos informados. | `200`, `404` |
| `DELETE` | `/books/:id` | Remove um livro. | `204`, `404` |
| `GET` | `/genres` | Lista os gêneros cadastrados. | `200` |
| `GET` | `/health` | Retorna estado da API sem consultar o banco. | `200` |

## Modelo de dados

`Book` contém título, autor, ano, páginas, progresso, avaliação, status, capa e gêneros. `Genre` contém ID e nome único.
`Book` e `Genre` têm relação muitos para muitos. `ReadingStatus` aceita `QUERO_LER`, `LENDO`, `LIDO`, `PAUSADO` e `ABANDONADO`.
IDs são inteiros; a API usa DTOs com validação de tipos e campos obrigatórios. O schema completo está em [`prisma/schema.prisma`](prisma/schema.prisma).

## Rodando localmente

Pré-requisitos: Node.js 20+, npm e Docker.

```bash
docker compose up -d
cp .env-example .env
npm ci
npx prisma migrate dev
npm run prisma:seed
npm run start:dev
```

No PowerShell: `Copy-Item .env-example .env`.
A API fica em `http://localhost:3001` e o Swagger em `http://localhost:3001/api`.

## Variáveis de ambiente

| Nome | Exemplo | Finalidade |
| --- | --- | --- |
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/bookshelf` | Conexão usada pela aplicação e pelo Prisma. |
| `DIRECT_DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/bookshelf` | Conexão direta usada em migrações. |
| `PORT` | `3001` | Porta HTTP; o Render define automaticamente. |

Exemplo local:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bookshelf"
DIRECT_DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bookshelf"
```

## Testes e CI

Jest cobre serviços e controllers unitariamente; o script E2E aplica migrações e executa testes HTTP com PostgreSQL real.
A CI em pull requests para `main` bloqueia arquivos `.db`, lint, build, testes unitários e E2E em Node.js 20.

```bash
npm test
npm run test:e2e
npm run lint
npm run build
```

## Deploy

Configure um PostgreSQL gerenciado e `DATABASE_URL` e `DIRECT_DATABASE_URL` no Render.
Build: `npm ci && npx prisma migrate deploy && npm run build`.
Start: `npm run start:prod`.
O health check usa `GET /health`; o workflow keep-alive pode consultar a URL configurada em `RENDER_SERVICE_URL` a cada 10 minutos.

## Decisões técnicas

- **Seed idempotente — reexecutar sem duplicar gêneros — trade-off:** livros conhecidos podem ser atualizados e registros adicionais são preservados.
- **DTO alinhado ao formulário — validação consistente na entrada — trade-off:** campos opcionais e inválidos precisam seguir o schema da API.
- **Erro Prisma `P2025` convertido em 404 — resposta previsível ao cliente — trade-off:** erros diferentes de P2025 continuam propagados.
- **Health sem banco — verifica apenas o processo da API — trade-off:** não sinaliza indisponibilidade interna do PostgreSQL.

## Licença

O `package.json` declara `UNLICENSED`; não há licença pública definida.
