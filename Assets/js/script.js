//Color
const targetColor = "rgb(255, 0, 0)";
const canonColor = "rgb(255, 255, 255)";
const projectileColor = "rgb(0, 255, 213)";

//variables
const popup = document.getElementById('gameOver_popup')
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 1500;
canvas.height = 600;
const vesselSize = 20;
let posY = canvas.height - vesselSize;
let posX = canvas.width / 2;

let lifeCompt = 2;

const projectiles = [];
const cibles = [];

let gamePaused = false;
//canon
class Canon {
  constructor(posX) {
    this.x = posX;
    this.y = posY;
    this.color = canonColor;
  }

  draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let h = vesselSize * (Math.sqrt(3) / 2);

    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.moveTo(0 + this.x, -h / 2 + this.y);
    ctx.lineTo(-vesselSize / 2 + this.x, h / 2 + this.y);
    ctx.lineTo(vesselSize / 2 + this.x, h / 2 + this.y);
    ctx.lineTo(0 + this.x, -h / 2 + this.y);
    ctx.fill();
    ctx.closePath();
  }
}
//projectile
class Projectile {
  constructor(posX, velocity) {
    this.x = posX;
    this.y = posY - vesselSize;
    this.radius = 2;
    this.v = velocity;
    this.color = projectileColor;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }

  update() {
    this.draw();
    this.y = this.y - this.v;
  }
}
//cible
class Target {
  constructor(posX, posY, velocity, radius) {
    this.x = posX;
    this.y = posY;
    this.radius = radius;
    this.v = velocity;
    this.color = targetColor;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }

  update() {
    this.draw();
    this.y = this.y + this.v;
  }
}

//animation du jeu
let animation;

function animate() {
  animation = requestAnimationFrame(animate);
  
//position du canon middle
  const vessel = new Canon(posX);
  vessel.draw();

  projectiles.forEach((projectile, index) => {
    projectile.update();

    //enlever le projectile une fois hors de l'écran
    if (projectile.y + projectile.radius < 0) {
      setTimeout(() => {
        projectiles.splice(index, 0);
      }, 0);
    }
  });
//systeme de vie
  cibles.forEach((cible, index) => {
    cible.update();

    const dist = canvas.height - cible.y;

    if (dist - cible.radius < 1) {
      lifeCompt = lifeCompt - 1;
      document.getElementById("lifeCompteur").innerHTML = lifeCompt;

      setTimeout(() => {
        cibles.splice(index, 1);
      }, 0);

      if (lifeCompt === 0) {
        document.getElementById("lifeCompteur").innerHTML = lifeCompt;
        cancelAnimationFrame(animation);
      }
    }

    // detection de collision entre les projectiles et les targets

    projectiles.forEach((projectile, projectileIndex) => {
      const dist = Math.hypot(projectile.x - cible.x, projectile.y - cible.y);

      if (dist - cible.radius - projectile.radius < 1) {
        setTimeout(() => {
          cibles.splice(index, 1);
          projectiles.splice(projectileIndex, 1);
        }, 0);
      }
    });
  });
}
//Spawn des cibles
function spawnCibles() {
  setInterval(() => {
    const radius = Math.random() * (50 - 5) + 5;
    const posX = CiblesPositionSpwan(radius);
    const posY = 0 - radius;
    const velocity = 1;
    cibles.push(new Target(posX, posY, velocity, radius));
  }, 2500);
}
//position des cible via Math.random()
function CiblesPositionSpwan(radius) {
  let r = radius;
  let spawnPos = Math.random() * canvas.width;

  return spawnPos < 0 || spawnPos < r
    ? (spawnPos = r)
    : spawnPos > canvas.width - r
    ? (spawnPos = canvas.width - r)
    : spawnPos;
}
// event touche fleche et espace
addEventListener("keydown", (e) => {
    //fleche
  if (e.key == "ArrowLeft" && posX >= vesselSize / 2) {
    posX -= 12;
  } else if (e.key == "ArrowRight" && posX <= canvas.width - vesselSize / 2) {
    posX += 12;
  }
//espace
  if (e.code == "Space") {
    projectiles.push(new Projectile(posX, 5));
  }
});

animate();
spawnCibles();
