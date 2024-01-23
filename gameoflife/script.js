let cells = []
let cellSize = 25
let gridWidth = 50
let gridHeight = 20
let gameState = false
let oldX,oldY
function setup() {
  let canvas = createCanvas(cellSize*gridWidth, cellSize*gridHeight)
  let htmlCanvas = canvas.canvas;
  frameRate(5)
  for (let ycell = 0; ycell < gridHeight; ycell++){
    for (let xcell = 0; xcell < gridWidth; xcell++){
      c = new cell(xcell,ycell)
      cells.push(c)
    }
  }
  drawCells()
}
function checkForEmptyBoard() {
  let deadCount =0
  cells.forEach(c => {
    if (c.state==false) {
      deadCount++
    }
  })
  if (deadCount == (gridHeight * gridWidth)) {
    gameState=false
  }
}
function checkForCells(x, y) {
  oldX = x
  oldY = y
  cells.forEach(c => {
    if (c.xPos == x && c.yPos == y) {
      if (c.state) {
        c.state = false
      } else {
        c.state = true
      }
      //c.calcNextState()
    }
  });
}
function changeFrames(value) {
  console.log(value);
  frameRate(value)
}
function draw() {
  if (gameState) {
    checkForEmptyBoard()
    //frameRate(document.getElementById("slider").value)
    cells.forEach(c => {
      c.calcNextState()
    });
    cells.forEach(c => {
      c.state = c.nextState
      
    });
    drawCells()
  }
}
function mouseClicked(params) {
  doWhenClicked()
}
function mouseDragged() {
doWhenClicked()
}
function doWhenClicked() {
  if (gameState) {
    return
  }
  xcor = Math.floor(mouseX / cellSize)
  ycor = Math.floor(mouseY / cellSize)
  if (oldX == xcor && oldY == ycor) {
    return
  }
  checkForCells(xcor,ycor)
  drawCells()

}
function drawCells() {
  clear()
  cells.forEach(c => {
    c.drawCell()
  });
}
function startPressed() {
gameState = true
}
function stopPressed() {
  gameState=false
}
function resetPressed() {
  gameState = false
  cells.forEach(c => {
    c.state = false
    c.nextState = false
  });
  drawCells()
}
function nextPressed() {
  cells.forEach(c => {
    c.calcNextState()
  });
  cells.forEach(c => {
    c.state = c.nextState
    
  });
  drawCells()
}
class cell{
  constructor(xPosCell,yPosCell) {
    this.xPos = xPosCell
    this.yPos = yPosCell
    this.id = (yPosCell*gridWidth) + xPosCell
    this.state = false
    this.nextState = false
  }
  drawCell() {
    if (this.state) {
      fill(252, 248, 3)
    } else {
      fill(61, 59, 59)
    }
    stroke("black")
    strokeWeight(3)
    square(this.xPos*cellSize, this.yPos*cellSize, cellSize)
  }
  calcNextState() {
    let stateCount = 0
    for (let i = -1; i <= 1; i++){
      for (let j = -1; j <= 1; j++){
        let idToCheck = (this.id + (i * gridWidth)) + j
        if (this.yPos == 0 && i == -1) {
          continue
        }if (this.yPos == (gridHeight - 1) && i == 1) {
          continue
        }if (this.xPos == 0 && j == -1) {
          continue
        } if (this.xPos == (gridWidth - 1) && j == 1) {
          continue
        }if (idToCheck == this.id) {
          continue
        }
        if (cells[idToCheck].state == true) {
          stateCount = stateCount+1
        }
        
      }
    }
    if (this.state && stateCount < 2) {
      this.nextState = false
    }
    if (this.state && (stateCount == 2 || stateCount == 3)) {
      this.nextState = true
    }
    if (this.state && stateCount > 3) {
      this.nextState = false
    }
    if (this.state == false && stateCount == 3) {
      this.nextState = true
    }
  }
}