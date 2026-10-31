# Task API - Gerenciador de Tarefas

API e aplicação web para gerenciamento de tarefas, desenvolvidas utilizando **Next.js 15, TypeScript, tRPC, React Query e Zod**.

O projeto permite realizar operações de criação, consulta, atualização e exclusão de tarefas (CRUD), além de oferecer carregamento incremental com Infinite Scroll e sincronização automática dos dados na interface.

## Tecnologias utilizadas

- **Next.js 15:** framework React com App Router e renderização no servidor (SSR).
- **TypeScript:** tipagem estática para maior segurança e organização do código.
- **tRPC:** comunicação entre frontend e backend com tipagem compartilhada.
- **React Query (TanStack Query):** gerenciamento de consultas, cache e atualização de dados.
- **Zod:** validação dos dados recebidos pela API.
- **Tailwind CSS:** estilização e construção da interface.
- **Node.js:** ambiente de execução do backend.

## Funcionalidades

### Gerenciamento de tarefas (CRUD)

- Criar tarefas com título e descrição.
- Consultar tarefas cadastradas.
- Editar tarefas existentes.
- Excluir tarefas com confirmação.
- Validar campos obrigatórios.
- Exibir mensagens de feedback após as operações.
- Tratar estados de carregamento e erros.

### Paginação e Infinite Scroll

- Carregamento inicial de cinco tarefas.
- Carregamento de mais cinco tarefas conforme a rolagem da página.
- Utilização de cursor para controle da paginação.
- Preservação da ordem original dos registros.
- Atualização automática da listagem após cadastrar uma tarefa.

### Contador de tarefas

- Exibe a quantidade total de tarefas cadastradas.
- Consulta independente da listagem paginada.
- Atualização automática após criação e exclusão.
- Retorna apenas a quantidade de registros, sem precisar carregar todas as tarefas.

### Interface

- Alternância entre visualização em lista e cards.
- Modal reutilizável para criação e edição.
- Confirmação antes da exclusão.
- Atualização automática da interface sem recarregar a página.

## Estrutura do projeto

```text
src/
├── app/
│   ├── api/
│   │   └── trpc/
│   │       └── [trpc]/
│   │           └── route.ts
│   └── page.tsx
│
├── components/
│   └── tasks/
│       ├── TaskManager.tsx
│       ├── TaskList.tsx
│       ├── TaskItem.tsx
│       ├── TaskModal.tsx
│       └── DeleteTaskDialog.tsx
│
├── server/
│   └── trpc/
│       ├── routers/
│       │   ├── _app.ts
│       │   └── task.router.ts
│       ├── services/
│       │   └── task.service.ts
│       ├── types/
│       │   └── task.ts
│       ├── trpc.ts
│       └── server.ts
│
└── trpc/
    └── react.ts
```

## Modelo de dados

Cada tarefa possui a seguinte estrutura:

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | string | Identificador único da tarefa (UUID) |
| `titulo` | string | Título da tarefa |
| `descricao` | string (opcional) | Descrição da tarefa |
| `dataCriacao` | number | Data de criação em timestamp |

## Endpoints da API

As operações são disponibilizadas por meio do router `task`.

| Procedimento | Tipo | Descrição |
|---|---|---|
| `task.create` | Mutation | Cria uma nova tarefa |
| `task.getAll` | Query | Retorna todas as tarefas |
| `task.getCount` | Query | Retorna a quantidade total de tarefas |
| `task.getPaginated` | Query | Retorna tarefas com paginação |
| `task.update` | Mutation | Atualiza uma tarefa existente |
| `task.delete` | Mutation | Exclui uma tarefa |

### Paginação

O procedimento `task.getPaginated` recebe os seguintes parâmetros:

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `cursor` | number | Posição inicial da consulta |
| `limit` | number | Quantidade de registros por página |

Exemplo de entrada:

```json
{
  "cursor": 0,
  "limit": 5
}
```

A resposta contém os registros encontrados e o cursor da próxima página, quando disponível.

## Como executar o projeto

### Pré-requisitos

- Node.js instalado.
- npm instalado.
- Git instalado.

### 1. Clonar o repositório

```bash
git clone https://github.com/neemias-araujo-dev/task-api.git
```

### 2. Acessar o diretório

```bash
cd task-api
```

### 3. Instalar as dependências

```bash
npm install
```

### 4. Executar em desenvolvimento

```bash
npm run dev
```

### 5. Acessar a aplicação

Abra o navegador no endereço:

```text
http://localhost:3000
```

## Armazenamento de dados

A aplicação utiliza armazenamento em memória (*in-memory storage*), conforme a proposta do desafio.

Os registros são mantidos em um array compartilhado no processo Node.js utilizando `globalThis`.

**Importante:** os dados não possuem persistência em banco de dados. Portanto, são perdidos quando o processo Node.js é reiniciado.

## Decisões técnicas

### Separação de responsabilidades

A aplicação foi organizada em camadas para facilitar a manutenção e evolução do código:

- **Components:** responsáveis pela interface e interação com o usuário.
- **Routers:** definem os procedimentos da API e validam as entradas com Zod.
- **Services:** concentram as regras de negócio e operações sobre as tarefas.
- **Types:** centralizam as definições de tipos utilizadas na aplicação.
- **tRPC:** fornece comunicação tipada entre frontend e backend.

### Renderização no servidor (SSR)

A página inicial utiliza uma consulta no servidor para obter os dados iniciais antes da renderização da interface.

### Gerenciamento de cache

O React Query mantém os dados sincronizados entre frontend e backend, evitando recarregamentos manuais após operações de CRUD.

### Infinite Scroll

A listagem utiliza paginação baseada em cursor e carregamento incremental, reduzindo a quantidade de registros exibidos inicialmente.

## Objetivo do projeto

O projeto foi desenvolvido como um desafio técnico, com o objetivo de demonstrar conhecimentos em desenvolvimento full stack, construção de APIs tipadas, validação de dados, gerenciamento de estado, paginação e organização de código utilizando tecnologias modernas do ecossistema React e Node.js.