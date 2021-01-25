let matrix = new Matrix(10, 10);

let w = matrix.width
let h = matrix.height
let playerCor = [74,84,94]
let obstakels = [[96, 97, 86, 87], [46, 47, 56, 57]]
let delaySize = 2000
let oldTime = 0 



function setup() {
  matrix.init()
  frameRate(5)
}

function draw() {
  matrix.clear()
  let x = readJoystickX()
  let y = readJoystickY()
 
  showPlayer()
  moveObstakels()
  matrix.show()

}

function showLed(row, col,state,Color) {
    matrix.setLed(row, col, state, color(Color))
}
function setLedNr(nr,state,Color) {
  let row = Math.floor(nr /h)
  let col = nr%w
  showLed(row,col,state,Color)
  
}
function keyPressed() {
  if (keyCode === 32) {//jump
    for (let cor = 0; cor < playerCor.length; cor++) {
      playerCor[cor] -= 20
      setLedNr(playerCor[cor],true,"yellow")
    }
    matrix.show()
    oldTime = millis()
    while (millis() < oldTime + delaySize) {
      //matrix.clear()
      moveObstakels()
      matrix.show()
    }
    console.log("hier");
    for (let cor = 0; cor < playerCor.length; cor++) {
      playerCor[cor] += 20
      setLedNr(playerCor[cor],true,"yellow")
      
    }
  }
  if (keyCode == DOWN_ARROW) {
    playerCor[0] = 92
    playerCor[1] = 93
  }
}

function moveObstakels() {
  obstakels.forEach(obstakel => {
    for (let led = 0; led < obstakel.length; led++) {
      obstakel[led] = obstakel[led] - 1
      let rowNew = Math.floor(obstakel[led] / h)
      let rowOld = Math.floor((obstakel[led] + 1) / h)
      if (rowNew != rowOld) {
        obstakel[led] = obstakel[led] +10
      }
      setLedNr(obstakel[led], true, 'red')
      console.log("gedaan");
    }
  })

}
function showPlayer() {
  playerCor.forEach(c => {
    setLedNr(c,true,"yellow")
  })
}
