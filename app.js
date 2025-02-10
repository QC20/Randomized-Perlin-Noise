console.clear()

// Use SimplexNoise instead of noise.perlin2
const noise = new SimplexNoise();

const dots = []
const c = document.querySelector('#c')
const ctx = c.getContext('2d')
const cw = ch = 1200
c.width = c.height = cw

for (let x=0; x<cw; x+=12){
  for (let y=0; y<ch; y+=12){
    dots.push({
      r: gsap.utils.clamp(.5, 10, noise.noise2D(x/200, y/200) *10),
      x: x+5,
      y: y+5,
      h: gsap.utils.random(300, 400, 1),
      a: 1
    })
  }
}

const tl = gsap.timeline({ onUpdate:render })
.to(dots, {
  duration: 2,
  h:()=> gsap.utils.random(180,240,1),
  r: 0.5,
  ease: 'power3',
  yoyoEase: 'power2.inOut',
  stagger:{
    amount: 4,
    from: 'center',
    grid:[100,100],
    yoyo: true,
    repeat: -1,
    repeatRefresh: true
  }
})
.seek(999)

gsap.to(window, { // randomize seed + speed, every 3 seconds
  duration:3,
  repeat:-1,
  onRepeat:()=> {
    dots.forEach(d =>{
      d.r = gsap.utils.clamp(.5, 20, noise.noise2D(d.x/200, d.y/200) *10)
      d.h = gsap.utils.random(300, 400, 1)
    })
    tl.invalidate()
    gsap.to(tl, {timeScale: gsap.utils.random(1, 3), ease:'sine.inOut'})
  }
})

function drawDot(d){
  ctx.fillStyle = 'hsla('+d.h+', 100%, 50%,'+d.a+')'
  ctx.beginPath()
  ctx.arc(d.x+d.r, d.y-d.r, d.r, 0, 2*Math.PI)
  ctx.fill()
}

function render(){
  ctx.clearRect(0, 0, cw, ch)
  dots.forEach( d => drawDot(d) )
}