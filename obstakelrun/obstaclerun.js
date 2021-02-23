/**
 * obstakel run
 * een speler dat over en onder verschillende obstakels moet raken
 * @LanderLeysen
 * @SanderDierckx
 * Engineering
 * V1.0
 */
 let w = 16
 let h = 16
let matrix = new Matrix(w, h);
let playerCor = [150, 166, 182]
let obstakels = [0, 0, 0, 0]
let randomIntObstakel = [173, 141]
let randomIntWolk = [94, 78, 62]
let wolk = [57, 58, 72, 73, 74, 75]
let oldTime = 0
let jumpTime = 0
let jump = false
let dive = false
let jumpDelay = 700
let diveDelay = 1000
let rate = 5
let score = 0
let highScore = 0
let start = false
let speedUps = [100, 200, 500, 750, 1000]
let speedUpCount = 0
let oldScore = 0
let aantalRijen = 0
let Top = [0, 0]
let a = 0
let muziek
let oofsound
let levelupsound
function setup() {
  matrix.init()
  soundFormats('mp3')
  muziek = loadSound('Castlevania Bloodlines - 8-bit Reincarnated Soul Part 2 (Stage 1) on Famitracker.mp3')
  oofsound = loadSound("Roblox Death Sound - OOF Sound Effect edit.mp3")
  levelupsound = loadSound('Level Up 8bit Sound Effects.mp3')
  frameRate(rate)
  calcObstakel(random(randomIntObstakel), "obstakel")// obstakel aan maken op random plaats (op de onderste tweedede tot vierde rijien)
  
}
// loopt hele tijd
function draw() {
  matrix.clear()
  if (start == true) {
    if (muziek.isPlaying() == false) {
      muziek.play()
  //muziek.volume(0.2)
    }
    if (jump == true || dive == true) {//zien of de speler gesprongen heeft of gebukt is 
      if (dive == true) {
        if (checkTime(oldTime, diveDelay)) {
          playerNormal()
          dive = false
        }
      } else {

        if (checkTime(oldTime, jumpDelay / 100)) {// als @jumpdelay milliseconden voorbij is naar beneden gaan
          jumpTime += jumpDelay / 10
          jumpStart(Math.ceil(basisvorm(jumpDelay - 100, jumpTime)))
        }
      }
    }
    setSky()
    showPlayer()
    moveObstakels(obstakels)
    moveObstakels(wolk)
    botsing()
    scoreCount()
    drawGras()
    showScore()
    scoreLeds()
    speedUp()
    matrix.show()
  }
  if (start == false) {
    if (checkTime(oldTime, 2000) == true) {
      reset()
      matrix.show()
    }
  }
}
/**
 * zet de speler op de juiste hoogte als hij gesprongen heeft
 * @param {int} jumpHeight: y waarde van jumpTime
 */
function jumpStart(jumpHeight) {
  if (jumpTime < Top[0]) {
    if (jumpHeight == 1 && jumpTime < calcX(1)) {
      moveRow("up")
    } if (jumpHeight == 2 && playerCor[0] == 134) {
      moveRow("up")
    }
  }
  else {
    if (jumpHeight == 2 && playerCor[0] == 118) {
      return
    } if (jumpHeight == 1 && playerCor[0] == 118) {
      moveRow("down")
      return
    } if (jumpHeight < 1 && jumpTime > (Top[0] * 2) - calcX(1) && playerCor[0] == 134) {
      moveRow("down")
    } if (jumpTime > jumpDelay - 200) {
      jump = false
      jumpTime = 0
    }
  }
}
/**
 * zet de speler 1 rij omhoog of omlaag
 * @param {string} richting "up" of "down"
 */
function moveRow(richting) {
  if (richting == "up") {
    for (let cor = 0; cor < playerCor.length; cor++) {
      playerCor[cor] -= 1 * w
    }
  } else {
    for (let cor = 0; cor < playerCor.length; cor++) {
      playerCor[cor] += 1 * w
    }
  }

}
/**
 * zet ledje aan of uit aan de hand van een rij en colom
 * @param {int} row 
 * @param {int} col 
 * @param {boolean} state 
 * @param {String} Color 
 */
function showLed(row, col, state, Color) {
  matrix.setLed(row, col, state, color(Color))
}
/**
 * zet nr om in rij en colom en zet dit ledje aan of uit
 * @param {int(n)} nr tussen 0 en WIDTH*HEIGHT
 * @param {boolean(n)} state aan of uit
 * @param {String} Color 
 */
function setLedNr(nr, state, Color) {
  let row = Math.floor(nr / h)
  let col = nr % w
  showLed(row, col, state, Color)

}
/**
 * controleert of er een toets word ingedrukt
 */
function keyPressed() {
  if (keyCode === 32) {
    if (jump == true||dive ==true) {// als er al gesprongen is niet meer springen
      return
    }
    jump = true
    oldTime = millis()
    jumpTime = 0
  }
  if (keyCode == DOWN_ARROW) {
    if (dive==true||jump == true) {// als hij al gebukt is niet meer kunnen bukken
      return
    }
    playerCor[0] = 167
    dive = true
    oldTime = millis()

  }
  if (keyCode === 83) {
    start = true
    let element = document.getElementById("speluitleg");
    element.className = "fade"
  }
}
/**
  * obstakel of wolk naar links laten bewegen
  *@param {array}  array: array van het obstakel/wolk we willen gebruiken
 */
function moveObstakels(array) {
  for (let led = 0; led < array.length; led++) {
    array[led] = array[led] - 1
    let col = array[led] % w
    if (led == array.length - 1) {
      let rowNew = Math.floor((array[led] - 3) / h)// de rij van nieuwe positie
      let rowOld = Math.floor((array[led] - 2) / h)// rij van oude positie
      if (rowNew != rowOld) {
        if (array == wolk) {
          calcObstakel(random(randomIntWolk), "wolk")
        } else {
          calcObstakel(random(randomIntObstakel), "obstakel")
        }
      }
    }
    if (array == wolk) {
      setLedNr(array[led], true, "white")
    } else {
      setLedNr(array[led], true, "rgb(69,69,69)")
    }
    if (col < 3 || col > 12) {
      setLedNr(array[led], false, "yellow")
    }
  }
}
/**
 * zet de ledjes van de speler aan
 */
function showPlayer() {// coördinaten speler laten zien en de kleur van de speler is geel
  playerCor.forEach(c => {
    setLedNr(c, true, "yellow")
  })
}
/**
 * kijkt of er een bepaalde tijd voorbij is gegaan
 * @param {int} time de start tijd
 * @param {int} delaySize grote van de delay
 */
function checkTime(time, delaySize) {
  return millis() > time + delaySize
}
/**
 * coördinaten speler normaal zetten
 */
function playerNormal() {
  playerCor[0] = 150
  playerCor[1] = 166
  playerCor[2] = 182
}
/**
 * coördinaten obstakel/wolk berekenen
 * @param {int} firstled plaats eerste ledje
 * @param {string} shape "obstakel" of "wolk"
 */
function calcObstakel(firstled, shape) {
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
    wolk[3] = wolk[2] + 1
    wolk[4] = wolk[3] + 1
    wolk[5] = wolk[4] + 1
  }
}
/**
 * kijken of de speler een obstakel geraakt heeft
 */
function botsing() {
  obstakels.forEach(obstakel => {
    playerCor.forEach(cor => {
      if (obstakel == cor) {
        start = false
        oldTime = millis()
        muziek.pause()
        oofsound.play()
        if (score > highScore) {
          highScore = score
        }
        //reset()
      }
    })
  })
}
// alle waarden terug naar het orginele zetten
function reset() {
  score = 0
  start = false
  jump = false
  dive = false
  rate = 5
  jumpDelay = 600
  diveDelay = 1000
  oldScore = 0
  aantalRijen = 0
  speedUpCount = 0
  playerNormal()
  calcObstakel(random(randomIntObstakel), "obstakel")
}
/**
 * alle ledjes in de zelfde kleur zetten
 * @param {boolean} state 
 * @param {string} Color 
 */
function setAll(state, Color) {
  for (let row = 0; row < w; row++) {
    for (let colom = 0; colom < h; colom++) {
      matrix.setLed(row, colom, state, Color)
    }

  }
}

//score tellen
function scoreCount() {
  obstakels.forEach(obstakel => {
    if (obstakel == 179 || obstakel == 163 || obstakel == 147 || obstakel == 131) {// als obstakel op het einde is score + 4
      score += 2
    }
  })
}
// controlleren op speedUp
function speedUp() {
  if (score >= speedUps[speedUpCount] - 5 && score <= speedUps[speedUpCount] + 5) {
    changeStats()
    levelupsound.play()
    speedUpCount += 1
    aantalRijen = 0
  }
}
// bij speed up waarden aanpassen
function changeStats() {
  playerNormal()
  rate += 1
  jumpDelay -= 100
  diveDelay -= 150
  jump = false
  //jumpTime = 0
  score = speedUps[speedUpCount] + 5// zorgen dat de functie niet opnieuw wordt aan geroepen
  frameRate(rate)
}
// onderste rij van speelveld groen maken
function drawGras() {
  for (let index = 3; index < 13; index++) {
    showLed(12, index, true, "green")

  }
}
// score laten zien op site
function showScore() {
  document.getElementById("score").innerHTML = "Score: " + str(score)//toon de score
  document.getElementById("highScore").innerHTML = "Highscore: " + str(highScore)//toon de highscore
}
// achtergrond blaauw zetten
function setSky() {
  for (let row = 3; row < 13; row++) {
    for (let colom = 3; colom < 13; colom++) {
      showLed(row, colom, true, "rgb(0,183,255)")
    }
  }
}
//score tot volgende speed up omzetten in rijen
function scoreLeds() {
  let scorePerRij = 0
  if (speedUpCount == 0) {
    scorePerRij = Math.floor(100/h)
  } else {
    scorePerRij = Math.floor((speedUps[speedUpCount] - speedUps[speedUpCount-1]) / h)//aantal punten nodig voor 1 rij
    
  }
  if (score > oldScore + scorePerRij) {
    oldScore = score
    aantalRijen += 1.26
  }
  for (let rij = 15; rij > 15 - aantalRijen; rij--) {
    for (let colom = 0; colom < 16; colom++) {
      if (rij > 2 && rij < 13 && colom > 2 && colom < 13) {
        continue
      }
      showLed(rij, colom, true, "rgb(153, 255, 0)")
    }
  }
}
/**
 * stelt parabool op en geeft y waarde terug
 * @param {int} delay  wanneer de parabool de x as moet snijden
 * @param {int} x om y waarde van deze x te berekenen
 */
function basisvorm(delay, x) {
  Top[0] = delay / 2 // defigneer de x-coödinaat van de top
  Top[1] = 2 // defigneer de y-coördinaat van de top
  a = -Top[1] / (Top[0] ** 2)
  return (a * ((x - Top[0]) ** 2)) + Top[1]
}
/**
 * x waarde berekenen aan de hand van zijn y waarde
 * @param {int} y waarde waar je de x waarde van wilt weten
 */
function calcX(y) {
  return sqrt(((y - Top[1]) / a) - Top[0])
}
