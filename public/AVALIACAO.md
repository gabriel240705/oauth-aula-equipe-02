# Entrega da Avaliação: GitHub Actions com IA

## Tarefa 1: CI a cada commit
- **Link da Execução Verde:** [COLE AQUI SEU LINK]
- **Link da Execução Vermelha:** [COLE AQUI SEU LINK]
- **Linha do erro no log:** [COLE AQUI A MENSAGEM DO SQLITE FALHANDO]
- **Por que a migração é testada em SQLite antes de chegar ao D1?**
  A migração é testada em um banco SQLite local efêmero para validar preventivamente a sintaxe e a lógica das queries, impedindo que instruções SQL corrompidas, inválidas ou destrutivas sejam aplicadas remotamente no banco de produção D1.

## Tarefa 2: Proteger a main com CI
- **Link do PR bloqueado:** [COLE AQUI SEU LINK]
- **Link do PR liberado:** [COLE AQUI SEU LINK]
- **Saída do git push recusado:**
  ```text
  [COLE AQUI O ERRO QUE DEU NO TERMINAL AO TENTAR FAZER PUSH DIRETO NA MAIN]