fetch("/api/me", { credentials: "same-origin" })
  .then(async (response) => {
    if (!response.ok) return null;
    return response.json();
  })
  .then((user) => {
    const status = document.getElementById("status");
    const loginArea = document.getElementById("login-area");
    const userArea = document.getElementById("user-area");
    const userName = document.getElementById("user-name");
    const userEmail = document.getElementById("user-email");
    const avatar = document.getElementById("avatar");

    if (!user) {
      status.innerHTML = 'Estado: <strong>Não autenticado</strong>';
      loginArea.hidden = false;
      userArea.hidden = true;
      return;
    }

    status.innerHTML = 'Estado: <strong>Autenticado</strong>';

    loginArea.hidden = true;
    userArea.hidden = false;

    userName.textContent = user.displayName || "Utilizador";
    userEmail.textContent = user.email || "";

    if (user.picture) {
      avatar.src = user.picture;
      avatar.hidden = false;
    }
  })
  .catch(() => {
    document.getElementById("status").innerHTML =
      'Estado: <strong>Não autenticado</strong>';
  });
