// hier komt je code
let veld = document.querySelector(".fig3")
let cijfer = veld.querySelector("h2")
veld.onclick = function () {
  let getal = parseInt(cijfer.innerHTML)
  if (getal == 4) {
    getal = 1
  } else {
    getal = getal +1
  }
  cijfer.innerHTML = getal
};
  