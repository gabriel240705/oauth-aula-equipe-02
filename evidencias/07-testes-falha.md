# Evidências – Testes de Falha

## Caso 1 – Retorno sem cookie temporário

**Preparação:**  
O login com GitHub foi iniciado em uma janela comum do navegador e a URL de autorização foi aberta em uma janela privativa, que não possuía o cookie temporário `__Host-oauth-tx`.

**Pedido enviado:**  
A autenticação foi concluída pelo GitHub na janela privativa e o provedor realizou o redirecionamento para a rota de callback da aplicação.

**Resultado esperado:**  
A aplicação deveria recusar o retorno por não encontrar o cookie temporário da transação e não deveria criar uma sessão autenticada.

**Resultado observado:**  
A aplicação recusou o retorno e apresentou a mensagem:

`Cookie temporário da transação não encontrado.`

Nenhuma sessão foi criada.

---

## Caso 2 – State alterado

**Preparação:**  
Foi iniciado um novo fluxo de login com GitHub. Antes de concluir a autorização, um único caractere do valor do parâmetro `state` foi alterado.

**Pedido enviado:**  
O fluxo de autorização foi concluído utilizando o valor de `state` modificado.

**Resultado esperado:**  
A aplicação deveria comparar o `state` recebido com o valor correspondente armazenado para a transação e recusar o retorno antes da troca do código de autorização.

**Resultado observado:**  
A aplicação recusou a solicitação e apresentou a mensagem:

`State inválido.`

Nenhuma sessão foi criada.

---

## Caso 3 – Reutilização da transação

**Preparação:**  
Foi realizado um login normal com Google até a criação bem-sucedida da sessão. A requisição de callback foi localizada no painel Network do navegador.

**Pedido enviado:**  
A URL do callback utilizada no fluxo já concluído foi aberta novamente.

**Resultado esperado:**  
A tentativa de reutilizar uma transação OAuth já concluída deveria ser recusada, sem permitir a criação de uma nova sessão.

**Resultado observado:**  
A aplicação recusou a reutilização e apresentou a mensagem:

`Cookie temporário da transação não encontrado.`

O cookie temporário já havia sido removido após a conclusão do fluxo e a tentativa de reutilização não criou uma nova sessão.

---

## Caso 4 – Sessão expirada

**Preparação:**  
Foi criada uma sessão autenticada normalmente. Em seguida, no console do banco D1, foi executado:

```sql
UPDATE sessions
SET expires_at = 0;
