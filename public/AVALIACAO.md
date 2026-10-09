# Entrega da Avaliação: GitHub Actions com IA

## Tarefa 1: CI a cada commit
- **Link da Execução Verde:** [COLE AQUI O LINK DA EXECUÇÃO VERDE DO ACTIONS]
- **Link da Execução Vermelha:** [COLE AQUI O LINK DA EXECUÇÃO VERMELHA DO ACTIONS]
- **Linha do erro no log:** `Error: Possível segredo no repositório`
- **Por que a migração é testada em SQLite antes de chegar ao D1?**
  A migração é testada numa base de dados SQLite local e efémera para validar preventivamente a sintaxe e a lógica das consultas (queries), impedindo que instruções SQL corrompidas, inválidas ou destrutivas sejam aplicadas remotamente na base de dados de produção D1.

## Tarefa 2: Proteger a main com CI
- **Link do PR bloqueado:** [COLE AQUI O LINK DO PR QUANDO ESTAVA BLOQUEADO]
- **Link do PR liberado:** [COLE AQUI O LINK DO PR DEPOIS DE APROVADO PELO ACTIONS]
- **Saída do git push recusado:**
  ```text
  remote: error: GH013: Repository rule violations found for refs/heads/main.
  remote: - Changes must be made through a pull request.
  remote: - Required status check "verificar" is expected.
  To [https://github.com/gabriel240705/oauth-aula-equipe-02](https://github.com/gabriel240705/oauth-aula-equipe-02)
   ! [remote rejected] main -> main (push declined due to repository rule violations)
  error: failed to push some refs to '[https://github.com/gabriel240705/oauth-aula-equipe-02](https://github.com/gabriel240705/oauth-aula-equipe-02)'