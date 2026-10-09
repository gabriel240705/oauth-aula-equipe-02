# Relatório de Avaliação do Projeto - Etapa 4

## Integrantes da Equipa
- Laura Gois Casteleins (Engenharia de Software)
- Gabriel Martins dos Santos Garai (Engenharia de Software)
- Gabriel Henrique Mendes (Engenharia de Software)
- Rennan Raposo da Silva (Engenharia de Software)
- Antonio Icaro da Silva (Engenharia Civil)
- Giovanna Godoy Hachmann Pizzamiglio (Arquitetura e Urbanismo)

---

## Resumo das Tarefas e Estado de Conclusão

### 1. Tarefa 1: Configuração Inicial e Estrutura do Repositório
- **Estado**: Concluído ✅
- **Descrição**: Configuração da estrutura de pastas do projeto, integração dos ficheiros base da aplicação web, definição do `wrangler.toml` e organização inicial das branches de desenvolvimento da equipa (`gabriel-correcao-ci` e `Laura-Casteleins-patch-1`).

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
  npx wrangler d1 migrations apply <NOME_DA_BASE> --local
