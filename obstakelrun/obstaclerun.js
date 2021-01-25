let matrix = new Matrix(10, 10);

let w = matrix.width
let h = matrix.height
let playerCor = [72, 82, 92]
let obstakels = [0,0,0,0]
let randomInt = [68,78,88]
let oldTime = 0
let jumpDelay = 750
let text = [[22,23,24,25,26,27,32,42,52,55,56,57,62,67,72,73,74,75,76,77],[22,23,24,25,26,27,32,37,42,47,52,53,54,55,56,57,62,67,72,77]]


function setup() {
  matrix.init()
  frameRate(7)
  calcObstakel(random(randomInt))// obstakel aan maken op random plaats (bop de onderste 3 rijen)
}
function draw() {
  matrix.clear()
  let x = readJoystickX()
  let y = readJoystickY()
  if (playerCor[0] == 52 ||playerCor[0] == 90) {//zien of de speler gesprongen heeft of gebukt heeft 
    if (checkTime()) {// als 750 milli seconden voorbij is naar beneden gaan
      playerNormal()
  } 
  }
  showPlayer()// de coördinaten van de speler laten branden
  moveObstakels()// obstakels laten bewegen
  botsing()// controleren op botsing
  matrix.show()
}

function showLed(row, col, state, Color) {
  matrix.setLed(row, col, state, color(Color))
}
function setLedNr(nr, state, Color) {// nummer van ledje vervagen in rij en colom
  let row = Math.floor(nr / h)
  let col = nr % w
  showLed(row, col, state, Color)

}
function keyPressed() {
  if (keyCode === 32) {
    if (playerCor[0] == 54) {// als er al gesprongen is niet meer springen
      return
    }
    oldTime = millis()
    for (let cor = 0; cor < playerCor.length; cor++) {// speler 2 rijen naar boven plaatsen
      playerCor[cor] -= 20
    }  
  }
  if (keyCode == DOWN_ARROW) {
    if (playerCor[0] == 92) {// als hij al gebukt is niet meer kunnen bukken
      return
    }
    oldTime=millis()
    playerCor[0] = 90// gebukte coördinaten
    playerCor[1] = 91
  }
}

function moveObstakels() {
    for (let led = 0; led < obstakels.length; led++) {
      obstakels[led] = obstakels[led] - 1// elke led van het obstakel 1 led naar links plaatsen
      let rowNew = Math.floor(obstakels[led] / h)// de rij van nieuwe positie
      let rowOld = Math.floor((obstakels[led] + 1) / h)// rij van oude positie

      if (rowNew != rowOld) {// als obstakel op het einde is terug naar begin plaatsen
        obstakels[led] = obstakels[led] + w
        if (led == 3) {// als alle leds van scherm zijn nieuwe random positei geven
          calcObstakel(random(randomInt))
          setLedNr(obstakels[led], true, "red")
          return
        }
      }
setLedNr(obstakels[led], true, "red")
  }
}
function showPlayer() {// coördinaten speler laten zien
  playerCor.forEach(c => {
    setLedNr(c, true, "yellow")
  })
}
function checkTime() {
  if (millis() > oldTime + jumpDelay) {// zien of er 750 milli seconden zijn gepaseerd
    return true
  }
}
function playerNormal() {// speler naar zijn orginele coördinaten zetten
  playerCor[0] = 72
  playerCor[1] = 82
  playerCor[2] = 92
}
function calcObstakel(firstled) {//obstakel plaatsen aan de hand van 1ste led
  obstakels[0] = firstled
  obstakels[1] = obstakels[0] + 1
  obstakels[3] = obstakels[0] + w
  obstakels[4] = obstakels[1] + w
}
function botsing() {
  obstakels.forEach(obstakel => {
    playerCor.forEach(cor => {
      if (obstakel == cor) {// coördinaten van speler en obstakel vergelijken
        console.log("kaka");
        setAll(true,"red")
      }
    })
  })
} 
function setAll(state, Color){
  for (let row = 0; row < w; row++) {
    for (let colom = 0; colom < h; colom++) {
      matrix.setLed(row,colom,state,Color)
    }
    
  }
}
