/**
 * Pathfinding with A* algorithem
 * @author sander dierckx
 * @version 1.0
 */

let cellSize = 20
let type = "wall"
let colors = { "wall": "black", "start": "green", "finish": "red" }
let startPlaced = false
let finishPlaced = false
let nodes = []

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
  if (type == "start" && startPlaced == true) {
    return
  }
  if (type == "finish" && finishPlaced == true) {
    return
  }
  let n = new node(type, cellNr, getx, gety)
  n.drawCell()
  nodes.push(n)
  if (type == "start") {
    startPlaced=true
  }
  if (type == "finish") {
    finishPlaced=true
  }
}

function keyPressed(){
  if (keyCode === 87) {
    type = "wall"
  }
  if (keyCode === 83) {
    type = "start"
  }
  if (keyCode === 70) {
    type = "finish"
  }
}

class node{
  constructor(type,cellNr,kol,rij){
    this.type = type
    this.cellNr = cellNr
    this.kol = kol
    this.rij = rij
    this.color = colors[this.type]
  }
  drawCell() {

    fill(this.color)
    rect(this.kol * cellSize, this.rij * cellSize, cellSize, cellSize)
    //console.log(Boats)
  }
}