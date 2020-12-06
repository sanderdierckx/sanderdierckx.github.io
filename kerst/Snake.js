let x_player1 = 500
let y_player1 = 500
let speed = 3
function setup() {
  createCanvas(windowWidth, windowHeight);
  background('#494949')
  rect(x_player1, y_player1, 20, 20)
  fill('#000000')
}

function draw() {
  keyPressed()
  checkEdges()
}
function keyPressed() {
  if (keyCode == UP_ARROW) {
    background('#494949')
    y_player1 = y_player1 - speed
    rect(x_player1, y_player1, 20, 20)
    fill('#000000')
  }
  if (keyCode == DOWN_ARROW) {
    background('#494949')
    y_player1 = y_player1 + speed
    rect(x_player1, y_player1, 20, 20)
    fill('#000000')
  }
  if (keyCode == RIGHT_ARROW) {
    background('#494949')
    x_player1 = x_player1 + speed
    rect(x_player1, y_player1, 20, 20)
    fill('#000000')
  }
  if (keyCode == LEFT_ARROW) {
    background('#494949')
    x_player1 = x_player1 - speed
    rect(x_player1, y_player1, 20, 20)
    fill('#000000')
  }

}
function checkEdges() {
  if (x_player1 > windowWidth || x_player1 < 0) {
    console.log("lol")
    speed = 0
  }
  if (y_player1 > windowHeight || y_player1 < 0) {
    console.log("lol")
    speed = 0
  }
}



























































