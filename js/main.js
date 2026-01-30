/* ===== TEAM DATA ===== */
const team = [
  { name: "Mersad", role: "Developer", img: "assets/member1.jpg" },
  { name: "Hs", role: "Designer", img: "assets/member2.jpg" },
  { name: "Jvad", role: "Manager", img: "assets/member3.jpg" },
  { name: "bioz", role: "Backend", img: "assets/member4.jpg" },
  { name: "yazdan", role: "Marketing", img: "assets/member5.jpg" },
  { name: "sasan", role: "UI/UX", img: "assets/member6.jpg" },
  { name: "kiarash", role: "GOD", img: "assets/member7.jpg" },
  { name: "erfan", role: "33", img: "assets/member8.jpg" },
  { name: "Ehsan", role: "siah mehraboon", img: "assets/member9.jpg" },
  
]

/* ===== ELEMENTS ===== */
const track = document.querySelector(".team-track")
const teamSection = document.querySelector("#team")
const prevBtn = document.querySelector(".team-btn.prev")
const nextBtn = document.querySelector(".team-btn.next")

if (!track || !teamSection) {
  console.error("TEAM elements not found")
}

/* ===== CREATE LOOP ITEMS ===== */
const items = [...team, ...team, ...team]
items.forEach(m => {
  const el = document.createElement("div")
  el.className = "member"
  el.innerHTML = `
    <img src="${m.img}">
    <h3>${m.name}</h3>
    <p>${m.role}</p>
  `
  track.appendChild(el)
})

const members = document.querySelectorAll(".member")
const blockSize = team.length

/* ===== STATE ===== */
let index = blockSize
let interval = null
let isDown = false
let startX = 0
let currentTranslate = 0

/* ===== POSITION ===== */
function updateSlider(animate = true) {
  members.forEach(m => m.classList.remove("active"))
  members[index].classList.add("active")

  const offset =
    members[index].offsetLeft -
    window.innerWidth / 2 +
    members[index].offsetWidth / 2

  track.style.transition = animate ? "transform 0.8s ease" : "none"
  track.style.transform = `translateX(-${offset}px)`
}

/* ===== INIT ===== */
updateSlider(false)

/* ===== AUTO SLIDE ===== */
function startAuto() {
  interval = setInterval(() => {
    index++
    updateSlider(true)

    if (index === blockSize * 2) {
      setTimeout(() => {
        index = blockSize
        updateSlider(false)
      }, 850)
    }
  }, 3000)
}

function stopAuto() {
  clearInterval(interval)
}

startAuto()

/* ===== HOVER PAUSE ===== */
teamSection.addEventListener("mouseenter", stopAuto)
teamSection.addEventListener("mouseleave", startAuto)

/* ===== DRAG ===== */
function getCurrentTranslate() {
  const matrix = new WebKitCSSMatrix(getComputedStyle(track).transform)
  return matrix.m41
}

track.addEventListener("mousedown", e => {
  isDown = true
  stopAuto()
  startX = e.clientX
  currentTranslate = getCurrentTranslate()
  track.style.transition = "none"
})

window.addEventListener("mousemove", e => {
  if (!isDown) return
  const move = e.clientX - startX
  track.style.transform = `translateX(${currentTranslate + move}px)`
})

window.addEventListener("mouseup", () => {
  if (!isDown) return
  isDown = false
  snapToClosest()
  startAuto()
})

/* ===== TOUCH ===== */
track.addEventListener("touchstart", e => {
  isDown = true
  stopAuto()
  startX = e.touches[0].clientX
  currentTranslate = getCurrentTranslate()
  track.style.transition = "none"
})

track.addEventListener("touchmove", e => {
  if (!isDown) return
  const move = e.touches[0].clientX - startX
  track.style.transform = `translateX(${currentTranslate + move}px)`
})

track.addEventListener("touchend", () => {
  isDown = false
  snapToClosest()
  startAuto()
})

/* ===== SNAP ===== */
function snapToClosest() {
  let closest = index
  let min = Infinity

  members.forEach((el, i) => {
    const rect = el.getBoundingClientRect()
    const center = rect.left + rect.width / 2
    const dist = Math.abs(center - window.innerWidth / 2)
    if (dist < min) {
      min = dist
      closest = i
    }
  })

  index = closest
  updateSlider(true)
}

/* ===== BUTTONS ===== */
if (prevBtn && nextBtn) {
  prevBtn.addEventListener("click", () => {
    stopAuto()
    index--
    updateSlider(true)
    startAuto()
  })

  nextBtn.addEventListener("click", () => {
    stopAuto()
    index++
    updateSlider(true)
    startAuto()
  })
}
