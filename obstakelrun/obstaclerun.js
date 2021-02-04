/**
 * obstakel run
 * Lander Leysen
 *Sander Dierckx
 *engineering
 *V1.0
 */
let matrix = new Matrix(16, 16);
let w = matrix.width
let h = matrix.height
let playerCor = [150, 166, 182]
let obstakels = [0, 0, 0, 0]
let randomIntObstakel = [172, 156,140]
let randomIntWolk = [92,76,60]
let wolk = [57,58,72,73,74,75]
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
// loopt hele tijd
function draw() {
  
  matrix.clear()
  let x = readJoystickX()
  let y = readJoystickY()
  if (start == true) {

    if (playerCor[0] == 118 || playerCor[0] == 181) {//zien of de speler gesprongen heeft of gebukt heeft 
      if (checkTime()) {// als 750 milliseconden voorbij is naar beneden gaan
        playerNormal()
      }
    }
    setGrass()// achtergrond blauw zetten
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
// laat ledje zien aan de hand van rij en colom
function showLed(row, col, state, Color) {
  matrix.setLed(row, col, state, color(Color))
}
//rij een col omzetten naar nummer
function setLedNr(nr, state, Color) {// nummer van ledje vervagen in rij en colom
  let row = Math.floor(nr / h)
  let col = nr % w
  showLed(row, col, state, Color)

}
function keyPressed() {
  if (keyCode === 32) {
    if (playerCor[0] != 150) {// als er al gesprongen is niet meer springen
      return
    }
    oldTime = millis()
    for (let cor = 0; cor < playerCor.length; cor++) {// speler 2 rijen naar boven plaatsen
      playerCor[cor] -= 2*w
    }
  }
  if (keyCode == DOWN_ARROW) {
    if (playerCor[0] != 150) {// als hij al gebukt is niet meer kunnen bukken
      return
    }
    oldTime = millis()
    playerCor[0] = 181// gebukte coördinaten
    playerCor[1] = 180
  }
  if (keyCode === 83) {
    start = true
  }
}
// obstakels/ wolkjes naar links opschuiven
function moveObstakels(array) {
  for (let led = 0; led < array.length; led++) {
    array[led] = array[led] - 1// elke led van het obstakel/wolk 1 led naar links plaatsen
    let rowNew = Math.floor((array[led]-3) / h)// de rij van nieuwe positie
    let rowOld = Math.floor((array[led] -2) / h)// rij van oude positie
    if (rowNew != rowOld) {// als obstakel/wolk op het einde is terug naar begin plaatsen
      array[led] = array[led] + w
      if (led == array.length-4 && array == obstakels) {// als alle leds van scherm zijn nieuwe random positie geven
        
        calcObstakel(random(randomIntObstakel),"obstakel")
        obstakels.forEach(obstakel => {
          setLedNr(obstakel, false, 'rgb(34,34,34)')
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
      setLedNr(array[led], false, 'rgb(34,34,34)')
    }
    else {
      setLedNr(array[led], true, "white")}}
}
function showPlayer() {// coördinaten speler laten zien en de kleur van de speler is geel
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
  playerCor[0] = 150
  playerCor[1] = 166
  playerCor[2] = 182
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
        if (score > highScore) { //controller of de score groter is dan de highscore
          
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
    if (obstakel==148||obstakel==180||obstakel==164) {// als obstakel op het einde is score + 5
      score += 2
    }
  })
}
// frame rate hoger zette
function speedUp() {
  if (score >= 95 && score <= 105 ||score >= 195 && score <= 205||score>=495&&score<=505||score >=745&&score<=755||score >=995&&score<=1005) {// versnellen bij bepaalde score
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
  for (let index = 3; index < 13; index++) {
    showLed(12,index,true,"green")
    
  }
}
function showScore() {
  document.getElementById("score").innerHTML="Score: " + str(score)//toon de score
  document.getElementById("highScore").innerHTML="Highscore: " + str(highScore)//toon de highscore
}
function setGrass() {//de rij van het gras berekenen
  for (let row = 3; row < 13; row++){
    for (let colom = 3; colom < 13; colom++){
      showLed(row,colom,true,"rgb(0,183,255)")
    }
  }
}