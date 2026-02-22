# Copilot Instructions for painel-agencia

## Visão Geral
Este projeto é um painel de agência desenvolvido em React, utilizando Vite e TailwindCSS. O código está organizado em módulos funcionais, com separação clara entre componentes de UI, páginas, hooks, entidades e utilitários.

## Estrutura Principal
- `src/` contém todo o código de aplicação.
  - `pages/`: páginas principais do app (Dashboard, Tickets, FareRules, etc).
  - `components/`: componentes reutilizáveis, organizados por domínio (dashboard, tickets, ui).
  - `api/`: clientes e integrações externas (ex: `Base44Client.js`).
  - `hooks/`: custom hooks (ex: `use-mobile.jsx`).
  - `lib/`: contexto de autenticação, navegação e utilidades globais.
  - `utils/`: funções utilitárias TypeScript.
- `entities/`: modelos de dados em JSON.

## Convenções e Padrões
- Componentes React usam extensão `.jsx` e seguem padrão de função.
- Componentes de UI genéricos ficam em `src/components/ui/` e são fortemente reutilizados.
- Dados de entidades (ex: Ticket, FareRule) são definidos em JSON em `entities/`.
- Hooks customizados ficam em `src/hooks/`.
- Contextos globais (ex: Auth) ficam em `src/lib/`.
- Configurações do Vite, Tailwind e PostCSS estão na raiz do projeto.

## Fluxos de Desenvolvimento
- **Build:** `npm run build` (usa Vite)
- **Dev:** `npm run dev` (servidor local Vite)
- **Dependências:** `npm install`
- **Tailwind:** Configurado via `tailwind.config.js` e `postcss.config.js`.

## Integrações e Comunicação
- Integração com serviços externos via arquivos em `src/api/`.
- Comunicação entre componentes via props/context API.
- Navegação controlada por React Router (ver `src/pages.config.js`).

## Exemplos de Padrão
- Para criar um novo componente de UI, siga o padrão de `src/components/ui/`.
- Para adicionar uma nova página, crie em `src/pages/` e registre em `pages.config.js`.
- Para hooks, siga o padrão de `src/hooks/use-mobile.jsx`.

## Observações
- Não há testes automatizados configurados por padrão.
- O arquivo `README.txt` está vazio; use este documento como referência principal para agentes de IA.
