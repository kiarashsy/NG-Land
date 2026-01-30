const express = require("express")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const fs = require("fs")
const path = require("path")

const router = express.Router()
const USERS_PATH = path.join(__dirname, "../users.json")
const SECRET = "NGLAND_SECRET_KEY"

const getUsers = () =>
  JSON.parse(fs.readFileSync(USERS_PATH, "utf8"))

router.post("/login", async (req, res) => {
  const { username, password } = req.body
  const users = getUsers()

  const user = users.find(u => u.username === username)
  if (!user) return res.status(401).json({ message: "Invalid credentials" })

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) return res.status(401).json({ message: "Invalid credentials" })

  const token = jwt.sign(
    { id: user.id, role: user.role },
    SECRET,
    { expiresIn: "2h" }
  )

  res.json({ token })
})

module.exports = router
