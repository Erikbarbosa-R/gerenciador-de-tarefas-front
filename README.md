# Gerenciador de Tarefas

Sistema de gerenciamento de tarefas desenvolvido em React com TypeScript, integrado com backend Node.js.

## Funcionalidades

- Autenticação de usuários (login/registro)
- Criação, edição e exclusão de tarefas
- Atribuição de tarefas para outros usuários
- Filtros por status, prioridade e usuário
- Interface responsiva e moderna
- Integração completa com API backend

## Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn

## Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd gerenciador-de-tarefas-front
```

2. Instale as dependências:
```bash
npm install
```

## Configuração

1. Configure a URL da API no arquivo `.env` (opcional):
```bash
REACT_APP_API_URL=https://sua-api-url.com/api
```

Se não configurado, será usado o valor padrão: `https://gerenciador-de-tarefas-production-7bba.up.railway.app/api`

## Comandos Disponíveis

### Desenvolvimento
```bash
npm start
```
Inicia o servidor de desenvolvimento na porta 3000.

### Build de Produção
```bash
npm run build
```
Cria uma versão otimizada para produção na pasta `build`.

### Testes
```bash
npm test
```
Executa os testes da aplicação.

### Linting
```bash
npm run lint
```
Executa o ESLint para verificar problemas no código.

## Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── Auth/           # Componentes de autenticação
│   ├── Layout/         # Componentes de layout
│   ├── Tasks/          # Componentes relacionados a tarefas
│   └── UI/             # Componentes de interface reutilizáveis
├── contexts/           # Contextos React (Auth, Tasks, Users)
├── services/           # Serviços de API
├── types/              # Definições TypeScript
└── utils/              # Utilitários
```

## Tecnologias Utilizadas

- React 18
- TypeScript
- Styled Components
- React Router
- Axios
- Context API

## Integração com Backend

A aplicação consome uma API REST com os seguintes endpoints:

- `POST /users/login` - Autenticação
- `POST /users/register` - Registro de usuário
- `GET /users` - Lista de usuários
- `GET /users/:id` - Usuário por ID
- `GET /tasks` - Lista de tarefas (com filtros)
- `GET /tasks/:id` - Tarefa por ID
- `POST /tasks` - Criar tarefa
- `PATCH /tasks/:id` - Atualizar tarefa
- `DELETE /tasks/:id` - Excluir tarefa

## Filtros Disponíveis

- **Todas as Tarefas**: Mostra todas as tarefas do sistema
- **Minhas Tarefas**: Tarefas delegadas para o usuário logado
- **Minhas Pendentes**: Tarefas pendentes delegadas para o usuário
- **Minhas Concluídas**: Tarefas concluídas delegadas para o usuário
- **Minhas Urgentes**: Tarefas de alta prioridade delegadas para o usuário
- **Por Status**: Filtro por status específico (0=Pendente, 1=Em Progresso, 2=Concluída)
- **Por Prioridade**: Filtro por prioridade específica (0=Baixa, 1=Média, 2=Alta, 3=Crítica)

## Status das Tarefas

- **0**: Pendente
- **2**: Concluída

## Prioridades das Tarefas

- **0**: Baixa
- **1**: Média
- **2**: Alta

## Desenvolvimento

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature
3. Faça commit das mudanças
4. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT.