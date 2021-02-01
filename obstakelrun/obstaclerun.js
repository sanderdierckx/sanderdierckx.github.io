let matrix = new Matrix(10, 10);
let w = matrix.width
let h = matrix.height
let playerCor = [62, 72, 82]
let obstakels = [0, 0, 0, 0]
let randomIntObstakel = [58, 68, 78]
let randomIntWolk = [8,18,28]
let wolk = [14,15,24,25,23,26]
let oldTime = 0
let jumpDelay = 1000
let rate = 5
let score = 0
let highScore = 0
let start = false


function setup() {
  matrix.init()
  frameRate(rate)
  calcObstakel(random(randomIntObstakel),"obstakel")// obstakel aan maken op random plaats (bop de onderste 3 rijen)
  
}
function draw() {
  
  matrix.clear()
  let x = readJoystickX()
  let y = readJoystickY()
  if (start == true) {

    if (playerCor[0] == 42 || playerCor[0] == 80) {//zien of de speler gesprongen heeft of gebukt heeft 
      if (checkTime()) {// als 750 milliseconden voorbij is naar beneden gaan
        playerNormal()
      }
    }
    setAll(true, "rgb(0,183,255)")// achtergrond blauw zetten
    showPlayer()// de coördinaten van de speler laten branden
    moveObstakels(obstakels)// obstakels laten bewegen
    moveObstakels(wolk)
    botsing()// controleren op botsing
    scoreCount()
    speedUp()
    drawGras()
    showScore()
  }
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
    if (playerCor[0] != 62) {// als er al gesprongen is niet meer springen
      return
    }
    oldTime = millis()
    for (let cor = 0; cor < playerCor.length; cor++) {// speler 2 rijen naar boven plaatsen
      playerCor[cor] -= 20
    }
  }
  if (keyCode == DOWN_ARROW) {
    if (playerCor[0] != 62) {// als hij al gebukt is niet meer kunnen bukken
      return
    }
    oldTime = millis()
    playerCor[0] = 80// gebukte coördinaten
    playerCor[1] = 81
  }
  if (keyCode === 83) {
    start = true
  }
}

function moveObstakels(array) {
  for (let led = 0; led < array.length; led++) {
    array[led] = array[led] - 1// elke led van het obstakel/wolk 1 led naar links plaatsen
    let rowNew = Math.floor(array[led] / h)// de rij van nieuwe positie
    let rowOld = Math.floor((array[led] + 1) / h)// rij van oude positie
    if (rowNew != rowOld) {// als obstakel/wolk op het einde is terug naar begin plaatsen
      array[led] = array[led] + w
      if (led == array.length-4&&array == obstakels) {// als alle leds van scherm zijn nieuwe random positie geven
        
          calcObstakel(random(randomIntObstakel),"obstakel")
          obstakels.forEach(obstakel => {
            setLedNr(obstakel, true, "rgb(69,69,69)")
          })
        return
      }
      if (led == array.length-6 && array == wolk) {
        calcObstakel(random(randomIntWolk),"wolk")
        wolk.forEach(w => { 
          setLedNr(w, true, "white")
        })
        return
      }
    }

    if (array == obstakels) {// de juiste kleur aan het object geven
      setLedNr(array[led], true, "rgb(69,69,69)")
    }
    else {
      setLedNr(array[led], true, "white")}}
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
  playerCor[0] = 62
  playerCor[1] = 72
  playerCor[2] = 82
}
function calcObstakel(firstled, shape) {//obstakel plaatsen aan de hand van 1ste led
  if (shape == "obstakel") {
    obstakels[0] = firstled
    obstakels[1] = obstakels[0] + 1
    obstakels[2] = obstakels[0] + w
    obstakels[3] = obstakels[1] + w  
  }
  else {
    wolk[0] = firstled
    wolk[1] = wolk[0] + 1
    wolk[2] = (wolk[0] + w) - 1
    wolk[3] = wolk[2] +1
    wolk[4] = wolk[3] + 1
    wolk[5] = wolk[4] +1
  }
}
function botsing() {
  obstakels.forEach(obstakel => {
    playerCor.forEach(cor => {
      if (obstakel == cor) {// coördinaten van speler en obstakel vergelijken 
        setAll(true, "red")
        if (score > highScore) {
          
          highScore = score
        }
        score = 0// alle waarden terug naar het orginele zetten
        start = false
        rate = 5
        jumpDelay =1000
      }
    })
  })
}
function setAll(state, Color) {// zet alle ledjes aan of uit
  for (let row = 0; row < w; row++) {
    for (let colom = 0; colom < h; colom++) {
      matrix.setLed(row, colom, state, Color)
    }

  }
}

//score tellen
function scoreCount() {
  obstakels.forEach(obstakel => {
    if (obstakel==80||obstakel==70||obstakel==60) {// als obstakel op het einde is score + 5
      score += 5
    }
  })
}
// frame rate hoger zette
function speedUp() {
  if (score >= 95 && score <= 105 ||score >= 195 && score <= 205||score>=495&&score<=505||score >=745&&score<=755||score >=995&&score<=1005) {// versnellen bij bepaalde code
    changeStats()
  }
}
function changeStats(){
  rate += 1// frame rate naar boven zetten
  jumpDelay -= 150//springen korter maken 

  frameRate(rate)
  score += 15// score +15 zodat deze functie niet opnieuw word aangeroepen
}
function drawGras() {// onderste rij groen maken
  for (let index = 0; index < 10; index++) {
    showLed(9,index,true,"green")
    
  }
}
function showScore() {
  document.getElementById("score").innerHTML="Score: " + str(score)
  document.getElementById("highScore").innerHTML="Highscore: " + str(highScore)
}