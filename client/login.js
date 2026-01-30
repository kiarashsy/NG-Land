document.getElementById("loginBtn").addEventListener("click", async () => {
  const username = document.getElementById("username").value
  const password = document.getElementById("password").value
  const error = document.getElementById("error")

  const res = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })

  const data = await res.json()

  if (!res.ok) {
    error.textContent = "Login failed"
    return
  }

  localStorage.setItem("ngland_token", data.token)
  window.location.href = "panel.html"
})
