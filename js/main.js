/* ===== TEAM DATA ===== */

const team = [
  {name:"Ali", role:"Developer", img:"assets/member1.jpg"},
  {name:"Sarah", role:"Designer", img:"assets/member2.jpg"},
  {name:"Kiarash", role:"Manager", img:"assets/member3.jpg"},
  {name:"Banafsh", role:"Marketing", img:"assets/member4.jpg"},
  {name:"Reza", role:"Backend", img:"assets/member5.jpg"},
  {name:"Nima", role:"UI/UX", img:"assets/member6.jpg"},
]

const track = document.querySelector('.team-track')

// کپی اعضا برای لوپ بی‌نهایت
const loopItems = [...team, ...team, ...team]
loopItems.forEach(m => {
  const div = document.createElement('div')
  div.className = 'member'
  div.innerHTML = `
    <img src="${m.img}">
    <h3>${m.name}</h3>
    <p>${m.role}</p>
  `
  track.appendChild(div)
})

const members = document.querySelectorAll('.member')
let index = Math.floor(members.length / 2) // شروع از وسط

/* ===== UPDATE SLIDER ===== */
function updateSlider(animate = true) {
  members.forEach(m => m.classList.remove('active'))
  members[index].classList.add('active')

  const offset =
    members[index].offsetLeft -
    (window.innerWidth / 2) +
    (members[index].offsetWidth / 2)

  track.style.transition = animate ? 'transform 1s ease' : 'none'
  track.style.transform = `translateX(-${offset}px)`
}

updateSlider(false)

/* ===== SCROLL BUTTON HERO ===== */
document.querySelector('.scroll-btn').addEventListener('click', e => {
  e.preventDefault()
  document.querySelector('#team').scrollIntoView({behavior:'smooth'})
})

/* ===== AUTO SLIDE ===== */
setInterval(() => {
  index++
  updateSlider()

  // اگر نزدیک لبه شد، برگرد وسط بدون انیمیشن
  if(index > members.length - team.length) {
    setTimeout(() => {
      index = Math.floor(members.length / 2)
      updateSlider(false)
    }, 1000)
  }
}, 5000)
