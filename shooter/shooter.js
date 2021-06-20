let w = 10
let h = 10
let matrix = new Matrix(w, h);

let playerCol = 4
const playerRow = 9
const bools = [true,false]
let bullets = []
let enemys = []
let healths = [0, "green", "rgb(0,255,234)", "rgb(0, 34, 255)", "rgb(170, 0, 255)", "rgb(255, 0, 0)"]
let oldTime = 0
let score = 0
let play = true
function setup(){
  matrix.init()
  frameRate(10)
}

function draw(){
  matrix.clear()
  if (play) {
    checkHit()
    checkDeath()
    setPlayer(playerCol)
    if (checkTime(oldTime, 3000)) {
      newWave()
    }
    bullets.forEach(b => {
      if (b.row < 1) {
        let bulletIndex = bullets.indexOf(b)
        bullets.splice(bulletIndex, 1)
        return
      }
      b.updateBullet()
    })
    enemys.forEach(e => {
      e.showEnemy()
    })
    
  }
  matrix.show()
}
function showLed(row, col, state, Color) {
  matrix.setLed(row, col, state, color(Color))
}
function setLedNr(nr, state, Color) {
  let row = Math.floor(nr / h)
  let col = nr % w
  showLed(row, col, state, Color)
}
function setPlayer(col) {
  showLed(playerRow, col, true, "green")
  showLed(playerRow, col + 1, true, "green")
  showLed(playerRow, col-1, true, "green")
  showLed(playerRow-1, col, true, "blue")
}
function keyPressed() {
  if (keyCode === LEFT_ARROW&&playerCol>=2) {
    playerCol-=1
  }
  if (keyCode === RIGHT_ARROW&&playerCol<=7) {
    playerCol+=1
  }
  if (keyCode === 32) {
    shoot()
  }
  if (keyCode === 82) {
    play = true
  }
}
function setAll(Color,state) {
  for (let i = 0; i <= w * h - 1; i++){
    setLedNr(i,state,Color)
  }
}
function getNumber(row, col) {
  return (row*w)+col
}
function shoot() {
  b = new bullet(playerCol)
  bullets.push(b)
  b.showBullet()
}
function newWave() {
  oldTime=millis()
  for (let i = 1; i <= 8; i++){
    if (random(bools)) {
      continue
    }
    e = new enemy(i)
    enemys.push(e)
  }
  enemys.forEach(e => {
    e.updateEnemy()
    e.showEnemy()
  })
}
function checkTime(time, delaySize) {
  return millis() > time + delaySize
}
function checkHit() {
  enemys.forEach(e => {
    enemyNumber = getNumber(e.row, e.colom)
    bullets.forEach(b => {
      bulletNumber = getNumber(b.row, b.colom)
      if (bulletNumber == enemyNumber) {
        e.health -= 1
        if (e.checkHealth()) {
          let enemyIndex = enemys.indexOf(e)
          enemys.splice(enemyIndex, 1)
          score += 1
          console.log(score);
        }
        let bulletIndex = bullets.indexOf(b)
        bullets.splice(bulletIndex, 1)
      }
    })
  })
}
function checkDeath() {
  enemys.forEach(e => {
    if (e.row == 9) {
      console.log("DEATH");
      play = false
      return
      }
  });
}
class bullet{
  constructor(col) {
    this.colom = col
    this.row = playerRow-1
  }
  showBullet() {
    showLed(this.row, this.colom, true, "red")
    //matrix.show()
  }
  updateBullet() {
    this.row -= 1
    this.showBullet()
  }
}
class enemy{
  constructor(col) {
    this.colom = col
    this.row = -1
    this.health = Math.floor(random(1, 5))
  }
  showEnemy() {
    showLed(this.row, this.colom, true, healths[this.health])
    matrix.show()
  }
  updateEnemy() {
    this.row += 1
    this.showEnemy()
  }
  checkHealth() {
    if (this.health == 0) {
      return true
    }
  }
}
