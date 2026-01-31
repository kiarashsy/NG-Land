const currentUser = JSON.parse(localStorage.getItem("currentUser"))

if (!currentUser) {
  window.location.href = "../index.html"
} else {
  document.getElementById("userName").textContent = currentUser.username
}

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("currentUser")
  window.location.href = "../index.html"
})

// نمونه اضافه کردن کاربران به جدول
const users = [
  { username: "Mersad", role: "Developer", status: "Active" },
  { username: "Hs", role: "Designer", status: "Active" },
  { username: "Jvad", role: "Manager", status: "Inactive" }
]

const tbody = document.getElementById("usersTable")
users.forEach(u => {
  const tr = document.createElement("tr")
  tr.innerHTML = `<td>${u.username}</td><td>${u.role}</td><td>${u.status}</td>`
  tbody.appendChild(tr)
})
const searchInput = document.getElementById("searchUser");
searchInput.addEventListener("input", e => {
  const val = e.target.value.toLowerCase();
  const trs = tbody.querySelectorAll("tr");
  trs.forEach(tr => {
    tr.style.display = tr.children[0].textContent.toLowerCase().includes(val) ? "" : "none";
  });
});
const toggle = document.getElementById("toggleTheme");
toggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
