# URL do front prod

https://gerenciador-de-tarefas-front-production.up.railway.app/login


# Gerenciador de Tarefas

Sistema de gerenciamento de tarefas desenvolvido em React com TypeScript, integrado com backend Node.js.

## Funcionalidades

- Autenticação de usuários (login/registro)
- Criação, edição e exclusão de tarefas
- Atribuição de tarefas para outros usuários
- Filtros por status, prioridade e usuário
- Interface responsiva e moderna
- Integração completa com API backend

## Como Rodar o Projeto Localmente

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn
- Git

### Passo a Passo

1. **Clone o repositório:**
```bash
git clone https://github.com/Erikbarbosa-R/gerenciador-de-tarefas-front.git
cd gerenciador-de-tarefas-front
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente (opcional):**
```bash
# Copie o arquivo de exemplo
cp env.example .env

# Edite o arquivo .env se necessário
# REACT_APP_API_URL=https://sua-api-url.com/api
```

4. **Inicie o servidor de desenvolvimento:**
```bash
npm start
```

5. **Acesse a aplicação:**
- Abra [http://localhost:3000](http://localhost:3000) no navegador
- A aplicação será recarregada automaticamente quando você fizer alterações

### Comandos Disponíveis

```bash
# Desenvolvimento
npm start          # Inicia servidor de desenvolvimento na porta 3000

# Build
npm run build      # Cria build de produção na pasta 'build'

# Testes
npm test           # Executa testes em modo interativo

# Linting
npm run lint       # Executa ESLint para verificar problemas no código
```

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

- **React 18** - Framework principal para interface
- **TypeScript** - Tipagem estática para JavaScript
- **Styled Components** - CSS-in-JS para estilização
- **React Router** - Roteamento client-side
- **Axios** - Cliente HTTP para comunicação com API
- **Context API** - Gerenciamento de estado global
- **React Icons** - Biblioteca de ícones
- **React Toastify** - Notificações toast

## Deploy e Arquitetura

### Deploy
A aplicação está hospedada no **Railway**:
- **URL de Produção**: https://gerenciador-de-tarefas-front-production.up.railway.app/login
- **Plataforma**: Railway (infraestrutura como serviço)
- **Build**: Automático via GitHub integration
- **Domínio**: Subdomínio personalizado do Railway

### Decisões de Arquitetura

#### Frontend
- **Arquitetura**: Single Page Application (SPA) com React
- **Estado**: Context API para gerenciamento global (Auth, Tasks, Users)
- **Estilização**: Styled Components para CSS-in-JS
- **Roteamento**: React Router para navegação client-side
- **HTTP**: Axios com interceptors para autenticação automática

#### Integração Backend
- **API REST**: Comunicação via HTTP/HTTPS
- **Autenticação**: JWT tokens armazenados no localStorage
- **Interceptors**: Axios configurado para injetar tokens automaticamente
- **Error Handling**: Tratamento centralizado de erros da API

#### Estrutura de Componentes
- **Organização**: Por funcionalidade (Auth, Tasks, Layout, UI)
- **Reutilização**: Componentes UI genéricos (Button, Input, etc.)
- **Separação**: Lógica de negócio nos contexts, apresentação nos components

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
- **Por Prioridade**: Filtro por prioridade específica (0=Baixa, 1=Média, 2=Alta)

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