import { Player } from "./player.js";
import { InputHandler } from "./inputs.js";
import { Background } from "./background.js";
import { FlyingEnemy, PlantEnemy, SpiderEnemy } from "./enemies.js";
import { Ui } from "./ui.js";

window.addEventListener("load", () => {
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 1000;
  canvas.hieght = 500;

  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.speed = 0;
      this.maxSpeed = 3;
      this.groundMargin = 50;
      this.player = new Player(this);
      this.input = new InputHandler();
      this.bg = new Background(this);
      this.Ui = new Ui(this);
      this.enemies = [];
      this.particles = [];
      this.collisions = [];
      this.maxParticles = 50;
      this.enemyInterval = 1700;
      this.enemyTimer = 0;
      this.score = 0;
      this.bestScore = JSON.parse(localStorage.getItem("bestScore")) || 0;
      this.gameOver = false;
      this.lives = 5;
      this.soundOn = true;
      this.level = "Very Easy";
      this.player.currentState = this.player.states[0];
      this.player.currentState.enter();
    }
    update(deltaTime) {
      // background scrolling
      this.bg.update();
      // update player movemnt based on key pressed
      this.player.update(this.input.keys, deltaTime);
      // enemies
      if (this.enemyTimer > this.enemyInterval) {
        this.addEnemy();
        this.enemyTimer = 0;
      } else {
        this.enemyTimer += deltaTime;
      }

      this.enemies.forEach((enemy) => {
        enemy.update(deltaTime);
        if (enemy.markForDeletion)
          this.enemies.splice(this.enemies.indexOf(enemy), 1);
      });
      // particles
      this.particles.forEach((particle, index) => {
        particle.update();
        if (particle.markedForDeletion) this.particles.splice(index, 1);
      });
      if (this.particles.length > this.maxParticles) {
        this.particles = this.particles.slice(0, this.maxParticles);
      }
      // collision
      this.collisions.forEach((collision, index) => {
        collision.update(deltaTime);
        if (collision.markedForDeletion) this.collisions.splice(index, 1);
      });
    }

    draw(ctx) {
      this.bg.draw(ctx);
      this.player.draw(ctx);
      this.enemies.forEach((enemy) => {
        enemy.draw(ctx);
      });
      this.particles.forEach((particle) => {
        particle.draw(ctx);
      });
      this.collisions.forEach((collision) => {
        collision.draw(ctx);
      });
      this.Ui.draw(ctx);
    }
    addEnemy() {
      if (this.speed > 0 && Math.random() < 0.5) {
        this.enemies.push(new PlantEnemy(this));
      } else if (this.speed > 0) {
        this.enemies.push(new SpiderEnemy(this));
      }

      this.enemies.push(new FlyingEnemy(this));
    }
  }

  const game = new Game(canvas.width, canvas.height);
  let lastTime = 0;
  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update(deltaTime);
    game.draw(ctx);

    if (game.score >= 130) {
      game.level = "Hard";
      game.enemyInterval = 400;
    } else if (game.score >= 100) {
      game.level = "Challenging";
      game.enemyInterval = 500;
    } else if (game.score >= 60) {
      game.level = "Intermediate";
      game.enemyInterval = 1000;
    } else if (game.score >= 30) {
      game.level = "Easy";
      game.enemyInterval = 1500;
    }

    if (!game.gameOver) {
      requestAnimationFrame(animate);
    }

    restartGame();
  }

  // start game button
  document
    .querySelector(".start-game button")
    .addEventListener("click", function () {
      document.querySelector(".start-game").style.display = "none";
      gameMusic();
      animate(0);
    });

  function restartGame() {
    addEventListener("keydown", (e) => {
      if (e.key === "Enter" && game.gameOver) {
        game.gameOver = false;
        game.enemies = [];
        game.particles = [];
        game.collisions = [];
        game.score = 0;
        game.lives = 5;
        game.player.currentState = game.player.states[0];
        game.player.currentState.enter();
        game.player.x = 100;
        game.player.y = game.height - game.player.height - game.groundMargin;
        game.enemyInterval = 1700;
        game.level = "Very Easy";
        animate(0);
      }
    });
  }

  // music
  const music = document.querySelector(".music");
  const musicIcon = document.querySelector(".music img");
  const musicGame = new Audio("../sounds/game-music.mp3");

  music.addEventListener("click", function () {
    this.classList.toggle("sound-on");

    if (this.classList.contains("sound-on")) {
      musicIcon.src = "../images/volume.png";
      game.soundOn = true;
      if (game.soundOn) gameMusic().play();
    } else {
      musicIcon.src = "../images/mute.png";
      game.soundOn = false;

      if (!game.soundOn) gameMusic().pause();
    }
  });

  function gameMusic() {
    if (game.soundOn && musicGame.currentTime <= 0) {
      musicGame.play();
    }
    return musicGame;
  }
  musicGame.addEventListener("ended", function () {
    this.currentTime = 0;
    this.play();
  });
});
