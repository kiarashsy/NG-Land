const token = localStorage.getItem("ngland_token")

if (!token) {
  window.location.href = "login.html"
}
