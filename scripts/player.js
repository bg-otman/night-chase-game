import {
  Setting,
  Runing,
  Jumping,
  Falling,
  Rolling,
  Diving,
  Hit,
} from "./playerState.js";

import { CollisionAnimation } from "./collisionAnimation.js";

export class Player {
  constructor(game) {
    this.game = game;
    this.width = 100;
    this.height = 91.3;
    this.image = document.getElementById("playerImg");
    this.x = 100;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.vy = 0;
    this.gravity = 1;
    this.speed = 0;
    this.maxSpeed = 10;
    this.frameX = 0;
    this.frameY = 0;
    this.fps = 20;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
    this.states = [
      new Setting(this.game),
      new Runing(this.game),
      new Jumping(this.game),
      new Falling(this.game),
      new Rolling(this.game),
      new Diving(this.game),
      new Hit(this.game),
    ];
  }
  update(inputs, deltaTime) {
    this.checkCollision();
    this.currentState.handleInput(inputs);
    // horizontal movemnt
    this.x += this.speed;
    if (inputs.includes("ArrowRight") && this.currentState !== this.states[6])
      this.speed = this.maxSpeed;
    else if (
      inputs.includes("ArrowLeft") &&
      this.currentState !== this.states[6]
    )
      this.speed = -this.maxSpeed;
    else this.speed = 0;
    // horizontal boundreis
    if (this.x < 0) this.x = 0;
    else if (this.x > this.game.width - this.width)
      this.x = this.game.width - this.width;
    // vertical movemnt
    this.y += this.vy;
    if (!this.onGround()) {
      this.vy += this.gravity;
    } else {
      this.vy = 0;
    }
    // vertical boundreis
    if (this.y > this.game.height - this.height - this.game.groundMargin) {
      this.y = this.game.height - this.height - this.game.groundMargin;
    }

    // animation
    if (this.frameTimer > this.frameInterval) {
      this.frameTimer = 0;
      this.frameX < this.maxFrame ? this.frameX++ : (this.frameX = 0);
    } else {
      this.frameTimer += deltaTime;
    }
  }
  draw(ctx) {
    ctx.drawImage(
      this.image,
      this.width * this.frameX,
      this.height * this.frameY,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
  onGround() {
    return this.y >= this.game.height - this.height - this.game.groundMargin;
  }
  setState(state, speed) {
    this.currentState = this.states[state];
    this.game.speed = this.game.maxSpeed * speed;
    this.currentState.enter();
  }
  checkCollision() {
    this.game.enemies.forEach((enemy) => {
      if (
        enemy.x < this.x + this.width &&
        enemy.x + enemy.width > this.x &&
        enemy.y < this.y + this.height &&
        enemy.y + enemy.height > this.y
      ) {
        enemy.markForDeletion = true;
        this.game.collisions.push(
          new CollisionAnimation(
            this.game,
            enemy.x + enemy.width * 0.5,
            enemy.y + enemy.height * 0.5
          )
        );
        if (
          (this.currentState === this.states[4] ||
            this.currentState === this.states[5]) &&
          enemy.canBeKilled
        ) {
          this.game.score++;
        } else {
          if (this.currentState === this.states[5]) {
            this.game.score += 2;
          } else {
            this.setState(6, 0);
            this.game.lives--;
            if (this.game.lives <= 0) {
              this.game.gameOver = true;
            }
          }
        }
      }
    });
  }
}
