# Task API

Aplicação simples de gerenciamento de tarefas, construída com Next.js, TypeScript e tRPC.

## Instalação

Requisitos: Node.js e npm.

```bash
git clone https://github.com/neemias-araujo-dev/task-api.git
cd task-api
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

Para gerar e iniciar a versão de produção:

```bash
npm run build
npm run start
```

## Funcionalidades

- Criar, listar, editar e excluir tarefas.
- Validar o título no formulário e no backend com Zod.
- Exibir o total de tarefas cadastradas.
- Pré-carregar as cinco primeiras tarefas no servidor e carregar as seguintes conforme a rolagem.
- Mostrar estados de carregamento, erro e confirmação das operações.

## API

Os procedimentos tRPC disponíveis são:

| Procedimento | Operação |
|---|---|
| `task.create` | Criar tarefa |
| `task.getAll` | Listar todas as tarefas |
| `task.getCount` | Consultar o total de tarefas |
| `task.getPaginated` | Listar tarefas por páginas |
| `task.update` | Atualizar tarefa |
| `task.delete` | Excluir tarefa |

Uma tarefa contém `id` (UUID), `titulo` (obrigatório), `descricao` (opcional) e `dataCriacao` (timestamp).

## Armazenamento

Os dados ficam em memória no processo Node.js e são apagados quando o processo reinicia. Como não há banco de dados, instâncias diferentes do servidor podem manter listas distintas.

## Parte teórica

As respostas às questões teóricas do case estão em [Respostas da Parte 1](docs/Respostas-Parte-1-Case-Produtividade.docx).

## Demonstração

[Abrir a aplicação online](https://task-api-bice-two.vercel.app/)
