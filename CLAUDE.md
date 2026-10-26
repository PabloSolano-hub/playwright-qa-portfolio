# CLAUDE.md — QA Automation Portfolio (Toolshop)

## Sobre o projeto

Portfólio público de QA Automation de Pablo Enrique Silva Solano (QA pleno), voltado a recrutadores de empresas na Espanha.
O objetivo é parecer a suíte de um time profissional: organizada, estável, com CI e com IA integrada ao fluxo de QA.

- Sistema testado: Practice Software Testing (Toolshop)
  - UI: https://practicesoftwaretesting.com
  - API: https://api.practicesoftwaretesting.com
  - Usuários de teste públicos (confirmar no site antes de usar):
    - customer@practicesoftwaretesting.com / welcome01
    - admin@practicesoftwaretesting.com / welcome01
- Nunca usar código, nomes, dados ou referências de empresas reais onde o Pablo trabalha. Tudo aqui é escrito do zero.

## Idiomas

- Converse comigo em português do Brasil.
- Código, nomes de arquivos, variáveis, comentários e mensagens de commit: inglês.
- Cenários de negócio (`scenarios/*.md`): espanhol.
- README: bilíngue, espanhol primeiro e inglês depois.

## Stack

- Playwright + TypeScript (strict mode)
- Node.js LTS, gerenciador npm
- @faker-js/faker para dados dinâmicos
- @axe-core/playwright para acessibilidade
- k6 para um teste de carga simples (pasta `performance/`)
- ESLint + Prettier
- GitHub Actions + GitHub Pages para o relatório HTML

## Estrutura de pastas

```
.
├── .claude/skills/            # skills de IA do fluxo de QA
├── .github/workflows/         # CI
├── scenarios/                 # cenários de negócio em espanhol (.md)
├── src/
│   ├── pages/                 # Page Objects
│   ├── fixtures/              # fixtures customizadas do Playwright
│   ├── api/                   # clientes de API reutilizáveis
│   ├── data/                  # factories com Faker
│   └── utils/
├── tests/
│   ├── e2e/                   # testes de interface
│   ├── api/                   # testes de API
│   └── a11y/                  # acessibilidade
├── performance/               # scripts k6
├── playwright.config.ts
└── README.md
```

## Padrões obrigatórios

1. Page Object Model: specs nunca usam seletores diretamente; isso fica nos Page Objects.
2. Seletores na ordem de preferência: `data-test` > `getByRole` > `getByLabel` > `getByText`. Nada de XPath ou CSS frágil.
3. Sem `waitForTimeout`. Usar as esperas automáticas e as asserções web-first (`expect(...).toBeVisible()` etc.).
4. Cada teste é independente: cria os próprios dados (de preferência via API) e não depende da ordem de execução.
5. Login reaproveitado com `storageState` gerado num setup project, não repetido em cada teste.
6. Cada spec referencia o ID do cenário de negócio que cobre (ex.: `@ESC-CARRITO-001` no título do teste) para manter rastreabilidade.
7. Configuração por variáveis de ambiente (`BASE_URL`, `API_URL`), com `.env.example` versionado e `.env` no `.gitignore`.
8. `npm run lint` e `npx tsc --noEmit` precisam passar antes de qualquer commit.

## Formato dos cenários de negócio

Arquivo por área em `scenarios/` (ex.: `scenarios/carrito.md`). Cada cenário:

```
### ESC-CARRITO-001 — Añadir un producto al carrito
- Prioridad: Alta
- Precondiciones: usuario autenticado
- Pasos:
  1. ...
- Resultado esperado: ...
- Automatizado en: tests/e2e/cart.spec.ts
```

## Fluxo de trabalho

1. Análise antes da execução: antes de codar, explore o site/API, me mostre um plano curto e espere meu OK.
2. Trabalhe em branches (`feat/...`, `test/...`, `ci/...`), nunca direto na `main`.
3. Commits pequenos, em inglês, no padrão Conventional Commits (`feat:`, `test:`, `ci:`, `docs:`, `refactor:`).
4. Ao fim de cada etapa, abra um PR com descrição clara (o que mudou, como testar) para eu revisar.
5. Rode os testes localmente antes de dizer que algo está pronto e mostre o resultado.
6. Se um teste falhar por instabilidade do site público, documente e trate (retry no CI, não esconder o problema).

## Scripts esperados no package.json

- `test` — todos os testes
- `test:e2e`, `test:api`, `test:a11y`
- `test:headed` — modo visual para depuração
- `report` — abre o relatório HTML
- `lint`, `format`

## CI (GitHub Actions)

- Roda em push e pull request para `main`.
- Matriz: chromium, firefox, webkit.
- Retries: 2 no CI, 0 local.
- Publica o relatório HTML no GitHub Pages a partir da `main`.
- Badge de status no topo do README.

## Roadmap

1. Setup: projeto, config, lint, estrutura de pastas, `.env.example`.
2. Primeiros Page Objects + 5 testes E2E (login, busca, filtro, carrinho, checkout) com seus cenários.
3. Testes de API (auth, produtos, carrinho) e criação de dados via API para os E2E.
4. CI com matriz de navegadores e relatório no GitHub Pages.
5. Skill de IA em `.claude/skills/manual-to-scenario/`: recebe um caso de teste manual em texto, gera o cenário de negócio em espanhol e um rascunho de spec Playwright seguindo este arquivo, sempre para revisão humana.
6. Acessibilidade com axe nas páginas principais.
7. Teste de carga simples em k6 na API de produtos (carga baixa, respeitando o site público).
8. README bilíngue: visão geral, arquitetura, como rodar, fluxo com IA, links para o relatório.
