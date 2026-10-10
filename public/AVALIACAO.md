# 📊 Relatório de Avaliação do Projeto - Etapa 4

---

## 👥 Integrantes da Equipa
- **Laura Gois Casteleins** — *Engenharia de Software*
- **Gabriel Martins dos Santos Garai** — *Engenharia de Software*
- **Gabriel Henrique Mendes** — *Engenharia de Software*
- **Rennan Raposo da Silva** — *Engenharia de Software*
- **Antonio Icaro da Silva** — *Engenharia Civil*
- **Giovanna Godoy Hachmann Pizzamiglio** — *Arquitetura e Urbanismo*

---

## 📋 Resumo das Tarefas e Estado de Conclusão

### 1️⃣ Tarefa 1: Configuração Inicial e Estrutura do Repositório
* **Estado:** Concluído ✅
* **Descrição:** Configuração da estrutura de pastas do projeto, integração dos ficheiros base da aplicação web, definição do `wrangler.toml` e organização inicial das branches de desenvolvimento da equipa (`gabriel-correcao-ci` e `Laura-Casteleins-patch-1`).

### 2️⃣ Tarefa 2: Implementação e Ajustes de CI (GitHub Actions)
* **Estado:** Concluído ✅
* **Descrição:** Criação e ajustes nos workflows de integração contínua (`ci.yml` e `migrar.yml`), garantindo a execução correta dos testes e validação automática de branches no GitHub.

### 3️⃣ Tarefa 3: Revisão Automatizada de Código por IA
* **Estado:** Concluído ✅
* **Descrição:** Configuração do workflow de IA (`revisao-ia.yml`), integração bem-sucedida do segredo `COPILOT_PAT` no repositório e abertura do Pull Request correspondente (`#1: Correcao do CI e teste de protecao da main`) para análise automatizada de código e segurança.
* **Link de Referência:** [Visualizar Pull Request #1](https://github.com/gabriel240705/oauth-aula-equipe-02/pull/1)

### 4️⃣ Tarefa 4: Gestão e Aplicação de Migrações Cloudflare D1
* **Estado:** Concluído ✅
* **Descrição:** Validação da estrutura de pastas de migração (`migrations/`), inclusão dos scripts SQL para gestão de tabelas (como a tabela de notas e utilizadores) e testes locais bem-sucedidos utilizando o Wrangler D1.
* **Comando de Validação/Aplicação Local:**
  ```bash
  npx wrangler d1 migrations apply <NOME_DA_BASE> --local

  1. Qual é a importância da automação de revisões de código por IA (GitHub Actions) no fluxo de desenvolvimento colaborativo?
Resposta: A automação com IA permite detetar vulnerabilidades de segurança (como SQL injection), inconsistências de estilo e falhas lógicas antes mesmo de o código ser fundido na branch principal (main). Isso reduz o esforço de revisão humana e garante um padrão de qualidade consistente em projetos desenvolvidos por equipas distribuídas.

2. Como a utilização de migrações estruturadas (Cloudflare D1 / Wrangler) garante a consistência do banco de dados entre os diferentes ambientes de desenvolvimento?
Resposta: As migrações versionadas em ficheiros SQL ordenados na pasta migrations/ asseguram que qualquer elemento da equipa possa replicar exatamente o mesmo esquema de base de dados no seu ambiente local (--local) ou em produção, evitando divergências estruturais e facilitando o rastreio de alterações nas tabelas.

3. De que forma a integração contínua (CI) e as regras de proteção de branch contribuem para a estabilidade do software?
Resposta: As regras de proteção impedem que código com falhas nos testes ou sem validação passe diretamente para a main. O CI executa automaticamente os testes unitários e de integração a cada push, servindo como uma barreira de segurança que assegura que o software permanece sempre funcional e pronto para deploy.
