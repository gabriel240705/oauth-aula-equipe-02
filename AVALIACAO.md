# Relatório de Avaliação do Projeto - Etapa 4

## Integrantes da Equipa
- Laura Gois Casteleins (Engenharia de Software)
- Gabriel Henrique Mendes (Engenharia de Software)

---

## Resumo das Tarefas e Estado de Conclusão

### 1. Tarefa 1: Configuração Inicial e Estrutura do Repositório
- **Estado**: Concluído ✅
- **Descrição**: Configuração da estrutura de pastas do projeto, integração dos ficheiros base da aplicação web, definição do `wrangler.toml` e organização inicial das branches de desenvolvimento da equipa (`gabriel-correcao-ci` e `Laura-Casteleins-patch-5`).

### 2. Tarefa 2: Implementação e Ajustes de CI (GitHub Actions)
- **Estado**: Concluído ✅
- **Descrição**: Criação e ajustes nos workflows de integração contínua (`ci.yml` e `migrar.yml`), garantindo a execução correta dos testes e validação automática de branches no GitHub.

### 3. Tarefa 3: Revisão Automatizada de Código por IA
- **Estado**: Concluído ✅
- **Descrição**: Configuração do workflow de IA (`revisao-ia.yml`), integração bem-sucedida do segredo `COPILOT_PAT` no repositório e abertura do Pull Request correspondente (`#1: Correcao do CI e teste de protecao da main`) para análise automatizada de código e segurança.
- **Link do Pull Request**: [Visualizar Pull Request #1](https://github.com/gabriel240705/oauth-aula-equipe-02/pull/1)

### 4. Tarefa 4: Gestão e Aplicação de Migrações Cloudflare D1
- **Estado**: Concluído ✅
- **Descrição**: Validação da estrutura de pastas de migração (`migrations/`), inclusão dos scripts SQL para gestão de tabelas (como a tabela de notas e utilizadores) e testes locais bem-sucedidos utilizando o Wrangler D1.
- **Comando de Validação/Aplicação Local**:
  ```bash
  npx wrangler d1 migrations apply <oauth-sessions-equipe-02> --local
----

1. Qual é a importância da automação de revisões de código por IA (GitHub Actions) no fluxo de desenvolvimento colaborativo?

Resposta: A automação com IA permite detetar vulnerabilidades de segurança (como SQL injection), inconsistências de estilo e falhas lógicas antes mesmo de o código ser fundido na branch principal (main). Isso reduz o esforço de revisão humana e garante um padrão de qualidade consistente em projetos desenvolvidos por equipas distribuídas.

2. Como a utilização de migrações estruturadas (Cloudflare D1 / Wrangler) garante a consistência do banco de dados entre os diferentes ambientes de desenvolvimento?

Resposta: As migrações versionadas em ficheiros SQL ordenados na pasta migrations/ asseguram que qualquer elemento da equipa possa replicar exatamente o mesmo esquema de base de dados no seu ambiente local (--local) ou em produção, evitando divergências estruturais e facilitando o rastreio de alterações nas tabelas.

3. De que forma a integração contínua (CI) e as regras de proteção de branch contribuem para a estabilidade do software?

Resposta: As regras de proteção impedem que código com falhas nos testes ou sem validação passe diretamente para a main. O CI executa automaticamente os testes unitários e de integração a cada push, servindo como uma barreira de segurança que assegura que o software permanece sempre funcional e pronto para deploy.

4. Quais são as vantagens de utilizar uma base de dados serverless baseada em SQLite (como o Cloudflare D1) numa arquitetura moderna orientada a serviços na edge?

Resposta: O Cloudflare D1 aproxima os dados dos utilizadores finais ao correr na edge network da Cloudflare, reduzindo drasticamente a latência das consultas. Além disso, por ser baseado em SQLite, oferece uma API relacional familiar e eficiente, eliminando a complexidade de gestão de infraestruturas de bases de dados tradicionais e escalando de forma automática conforme a procura.
