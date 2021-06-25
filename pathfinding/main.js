/**
 * Pathfinding with A* algorithem
 * @author sander dierckx
 * @version 1.0
 */
// types [wall,start,finish,tile]
let cellSize = 20
let clickType = "wall"
let colors = { "wall": "black", "start": "green", "finish": "red" }
let startPlaced = false
let finishPlaced = false
let nodes = []
let startNode = null
let finishNode = null

function setup() {
  let can = createCanvas(windowWidth,windowHeight)
  can.parent('canvas')
  can.background("white")
  drawMatrix()
}
function draw() {
}
function drawMatrix() {
  for (let i = 1; i < windowHeight; i++) {
    strokeWeight(3)
    line(0, i * cellSize,windowWidth, i * cellSize)
  }
  for (let i = 1; i < windowWidth; i++) {
    strokeWeight(3)
    line(i * cellSize, 0, i * cellSize,windowHeight)
}
}
function mousePressed() {
  let getx = Math.floor(mouseX / cellSize)
  let gety = Math.floor(mouseY / cellSize)
  let cellNr = (gety * (windowHeight / cellSize)) + getx
  if (clickType == "start" && startPlaced == true) {
    return
  }
  if (clickType == "finish" && finishPlaced == true) {
    return
  }
  if (clickType == "remove"){
    nodes.forEach(no => {
      if (no.cellNr == cellNr) {
        if (no.type == "start") {//wanneer start verwijderen nieuwe start kunne plaatsen
          startPlaced=false
        }
        if (no.type == "finish") {
          finishPlaced=false
        }
        let nodeIndex = nodes.indexOf(no)// node uit array halen
        nodes.splice(nodeIndex, 1)
      }
    })
    update()
    return
  }
  console.log("ja");
  let n = new node(clickType, cellNr, getx, gety)
  n.drawCell()
  nodes.push(n)
  if (clickType == "start") {
    startPlaced = true
    n.explored = true
  }
  if (clickType == "finish") {
    finishPlaced=true
  }
  if (startPlaced && finishPlaced) {
    nodes.forEach(n => {
      if (n.type == "start") {
        startNode == n
      }
      if (n.type == "finish") {
        finishNode == n
      }
    })
  }
}
function update() {
  background("white")
  drawMatrix()
  nodes.forEach(n => {
    n.drawCell()
  })
}

function keyPressed() {
  if (keyCode === 87) {
    clickType = "wall"
  }
  if (keyCode === 83) {
    clickType = "start"
  }
  if (keyCode === 70) {
    clickType = "finish"
  }
  if (keyCode === 82) {
    clickType = "remove"
  }
}
function explore() {
  let masterNode = null
  nodes.forEach(n => {
    if (n.explored) {
      if (n.gCost > masterNode.gCost||masterNode==null) {
        masterNode = n
      } else {
        continue
      }
    }
  })
}
class node{
  constructor(type,cellNr,kol,rij){
    this.type = type
    this.cellNr = cellNr
    this.kol = kol
    this.rij = rij
    this.color = colors[this.clickType]
    this.explored = false
    this.gCost = null
    this.hCost = null
    this.fCost = this.gCost+this.hCost
  }
  drawCell() {
    fill(this.color)
    rect(this.kol * cellSize, this.rij * cellSize, cellSize, cellSize)
  }
  calcCosts() {
  //G-cost
    if (startNode.rij == this.rij) {
      this.gCost= abs(startNode.rij-this.rij)
    }
    if (startNode.kol == this.kol) {
      this.gCost= abs(startNode.kol-this.kol)
    }
  }
}