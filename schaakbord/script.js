const canvas = document.getElementById("Canvas");
const ctx = canvas.getContext("2d");

let pieces = [];
let board = [];
let turn = false; //false=white true=black
let liftedPiece = { color: "none", x: 0, y: 0 };
function drawRect(x, y, w, h, fill = "fff") {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

function update() {
  pieces.forEach((p) => {
    if (p.state == true) {
      p.calcAllNextPath();
      p.checkNextPath();
      let cells = board.filter((b) => p.nextPath.includes(b.id));
      cells.forEach((c) => (c.state = "possible"));
    }
  });

  if (pieces.filter((p) => p.state).length == 0) {
    board.forEach((b) => (b.state = "free"));
    let cells = board.filter((b) => pieces.map((p) => p.place).includes(b.id));
    cells.forEach((c) => (c.state = "taken"));
  }
  draw();
}
canvas.addEventListener("click", (e) => {
  let y = Math.floor(e.offsetY / 80);
  let x = Math.floor(e.offsetX / 80);
  let place = y * 8 + x;
  p = pieces.find((piece) => piece.place == place);

  if (p != undefined) {
    if (
      pieces.filter((piece) => piece.state).length < 1 ||
      pieces.find((piece) => piece.state).place == place
    ) {
      p.state = !p.state;
      let b = board.filter((cell) => cell.x == x && cell.y == y)[0];
      if (b.state == "lifted") b.state = "free";
      else b.state = "lifted";
    }
  } else {
    let lifted = pieces.find((piece) => piece.state);
    if (lifted.nextPath.includes(y * 8 + x)) {
      lifted.x = x;
      lifted.y = y;
      lifted.state = false;
      lifted.updatePlace();
    }
  }
  update();
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  board.forEach((b) => b.drawCell());
  pieces.forEach((p) => p.placePiece());
}
class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.id = y * 8 + x;
    this.state = "free";
  }
  drawCell() {
    if (this.state == "free" || this.state == "taken") {
      if (this.y % 2 == 0) {
        if (this.x % 2 == 0) {
          drawRect(this.x * 80, this.y * 80, 80, 80, "#525252");
        } else {
          drawRect(this.x * 80, this.y * 80, 80, 80, "#fff");
        }
      }
      if (this.y % 2 != 0) {
        if (this.x % 2 != 0) {
          drawRect(this.x * 80, this.y * 80, 80, 80, "#525252");
        } else {
          drawRect(this.x * 80, this.y * 80, 80, 80, "#fff");
        }
      }
    } else if (this.state == "lifted") {
      drawRect(this.x * 80, this.y * 80, 80, 80, "#0f0");
    } else if (this.state == "possible") {
      drawRect(this.x * 80, this.y * 80, 80, 80, "#00f");
    }
  }
}
for (let i = 0; i < 8; i++) {
  for (let j = 0; j < 8; j++) {
    board.push(new Cell(j, i));
  }
}
board.forEach((b) => b.drawCell());
class Piece {
  constructor(type, color, place) {
    this.type = type;
    this.color = color;
    this.place = place;
    this.y = Math.floor(this.place / 8);
    this.x = this.place - this.y * 8;
    this.state = false;
    this.nextPath = [];
  }
  updatePlace() {
    this.place = this.y * 8 + this.x;
  }
  placePiece() {
    let base_image = new Image();
    base_image.src = `img/${this.type}_${this.color.charAt(0)}.png`;
    let y = this.y * 80;
    let x = this.x * 80;
    let size = 80;
    if (this.state) {
      size += 20;
      x -= 10;
      y -= 10;
    }
    base_image.onload = function () {
      ctx.drawImage(base_image, x, y, size, size);
    };
  }
  calcAllNextPath() {
    this.nextPath = [];
    switch (this.type) {
      case "pawn":
        if (this.color == "white") {
          this.nextPath.push(this.place + 8);
          if (this.y == 1) {
            this.nextPath.push(this.place + 16);
          }
        } else {
          this.nextPath.push(this.place - 8);
          if (this.y == 6) {
            this.nextPath.push(this.place - 16);
          }
        }
        break;
      case "rook":
        for (let i = this.x - 1; i >= 0; i--) {
          this.nextPath.push(this.y * 8 + i);
        }
        for (let i = this.x + 1; i < 8; i++) {
          this.nextPath.push(this.y * 8 + i);
        }
        for (let i = this.y - 1; i >= 0; i--) {
          this.nextPath.push(i * 8 + this.x);
        }
        for (let i = this.y + 1; i < 8; i++) {
          this.nextPath.push(i * 8 + this.x);
        }
        break;
      case "knight":
        if (this.x >= 1 && this.y >= 2) this.nextPath.push(this.place - 17);
        if (this.x <= 6 && this.y >= 2) this.nextPath.push(this.place - 15);

        if (this.x >= 2 && this.y >= 1) this.nextPath.push(this.place - 10);
        if (this.x <= 5 && this.y >= 1) this.nextPath.push(this.place - 6);

        if (this.x <= 6 && this.y <= 5) this.nextPath.push(this.place + 17);
        if (this.x >= 1 && this.y <= 5) this.nextPath.push(this.place + 15);

        if (this.x <= 5 && this.y <= 6) this.nextPath.push(this.place + 10);
        if (this.x >= 2 && this.y <= 6) this.nextPath.push(this.place + 6);
        break;
      case "bishop":
        for (let i = this.x - 1; i >= 0; i--) {
          this.nextPath.push((this.y - this.x + i) * 8 + i);
          this.nextPath.push((this.y + this.x - i) * 8 + i);
        }
        for (let i = this.x + 1; i < 8; i++) {
          this.nextPath.push((this.y - this.x + i) * 8 + i);
          this.nextPath.push((this.y + this.x - i) * 8 + i);
        }
        break;
      case "queen":
        for (let i = this.x - 1; i >= 0; i--) {
          this.nextPath.push(this.y * 8 + i);
          this.nextPath.push((this.y - this.x + i) * 8 + i);
          this.nextPath.push((this.y + this.x - i) * 8 + i);
        }
        for (let i = this.x + 1; i < 8; i++) {
          this.nextPath.push(this.y * 8 + i);
          this.nextPath.push((this.y - this.x + i) * 8 + i);
          this.nextPath.push((this.y + this.x - i) * 8 + i);
        }
        for (let i = this.y - 1; i >= 0; i--) {
          this.nextPath.push(i * 8 + this.x);
        }
        for (let i = this.y + 1; i < 8; i++) {
          this.nextPath.push(i * 8 + this.x);
        }
        break;
      case "king":
        let place = this.y * 8 + this.x;
        for (let i = -1; i <= 1; i += 2) {
          this.nextPath.push(place + 9 * i);
          this.nextPath.push(place + 8 * i);
          this.nextPath.push(place + 7 * i);

          this.nextPath.push(place + 1 * i);
        }

        break;
      default:
        break;
    }
    this.nextPath = this.nextPath.filter((p) => {
      if (p < 0 || p > 63) {
        return false;
      } else {
        return true;
      }
    });
  }
  checkNextPath() {
    let flags = [];
    this.nextPath = this.nextPath.filter((n) => {
      let pieceCells = pieces.map((p) => p.place);
      if (pieceCells.includes(n)) {
        let p = pieces.find((e) => e.place == n);
        if (p.color == this.color) {
          flags.push({
            pPlaceX: p.x,
            pPlaceY: p.y,
            thisPlaceX: this.x,
            thisPlaceY: this.y,
          });
          return false;
        }
        if (this.type != "knight") {
          flags.push({
            pPlaceX: p.x,
            pPlaceY: p.y,
            thisPlaceX: this.x,
            thisPlaceY: this.y,
          });
        }
        return true;
      } else {
        return true;
      }
    });
    console.table(flags);
    this.nextPath = this.nextPath.filter((n) => {
      let nY = Math.floor(n / 8);
      let nX = n - nY * 8;
      for (let i = 0; i < flags.length; i++) {
        let flag = flags[i];

        if (
          nX == flag.pPlaceX &&
          ((flag.pPlaceY > flag.thisPlaceY && nY > flag.pPlaceY) ||
            (flag.pPlaceY < flag.thisPlaceY && nY < flag.pPlaceY))
        )
          return false;
        else if (
          nY == flag.pPlaceY &&
          ((flag.pPlaceX > flag.thisPlaceX && nX > flag.pPlaceX) ||
            (flag.pPlaceX < flag.thisPlaceX && nX < flag.pPlaceX))
        )
          return false;
        else if (nY > flag.pPlaceY) {
          if (nX < flag.pPlaceX) {
            //links onder
            if (
              flag.pPlaceY > flag.thisPlaceY &&
              flag.pPlaceX < flag.thisPlaceX
            )
              return false;
          }
          if (nX > flag.pPlaceX) {
            //rechts onder
            if (
              flag.pPlaceY > flag.thisPlaceY &&
              flag.pPlaceX > flag.thisPlaceX
            ) {
              return false;
            }
          }
        } else if (nY < flag.pPlaceY) {
          if (nX < flag.pPlaceX) {
            //links boven
            if (
              flag.pPlaceY < flag.thisPlaceY &&
              flag.pPlaceX < flag.thisPlaceX
            )
              return false;
          } else if (nX > flag.pPlaceX) {
            //rechts boven
            console.log(`${nX},${nY}:`);
            console.table(flag);
            if (
              flag.pPlaceY < flag.thisPlaceY &&
              flag.pPlaceX > flag.thisPlaceX
            )
              return false;
          }
        }
      }
      return true;
    });
  }
}

//pawns
for (let i = 0; i < 15; i++) {
  if (i < 8) {
    pieces.push(new Piece("pawn", "white", i + 8));
  } else {
    pieces.push(new Piece("pawn", "black", i + 40));
  }
}
//rooks
pieces.push(new Piece("rook", "white", 0));
pieces.push(new Piece("rook", "white", 7));
pieces.push(new Piece("rook", "black", 56));
pieces.push(new Piece("rook", "black", 63));

//knights
pieces.push(new Piece("knight", "white", 1));
pieces.push(new Piece("knight", "white", 6));
pieces.push(new Piece("knight", "black", 57));
pieces.push(new Piece("knight", "black", 62));

//bishops
pieces.push(new Piece("bishop", "white", 2));
pieces.push(new Piece("bishop", "white", 55));
pieces.push(new Piece("bishop", "black", 58));
pieces.push(new Piece("bishop", "black", 61));

//queens
pieces.push(new Piece("king", "white", 35));
pieces.push(new Piece("queen", "black", 59));

//kings
pieces.push(new Piece("king", "white", 4));
pieces.push(new Piece("king", "black", 60));

pieces.forEach((p) => p.placePiece());

let cells = board.filter((b) => pieces.map((p) => p.place).includes(b.id));
cells.forEach((c) => (c.state = "taken"));
