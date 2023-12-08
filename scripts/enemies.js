class Enemy {
  constructor() {
    this.frameX = 0;
    this.frameY = 0;
    this.fps = 20;
    this.enemyInterval = 1000 / this.fps;
    this.enemyTimer = 0;
    this.x = 0;
    this.y = 0;
    this.markForDeletion = false;
  }
  update(deltaTime) {
    this.x -= this.speedX + this.game.speed;
    this.y += this.speedY;
    if (this.enemyTimer > this.enemyInterval) {
      this.enemyTimer = 0;
      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = 0;
    } else this.enemyTimer += deltaTime;

    if (this.x < 0 - this.width) this.markForDeletion = true;
  }
  draw(ctx) {
    ctx.drawImage(
      this.image,
      this.frameX * this.width,
      0,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}

export class FlyingEnemy extends Enemy {
  constructor(game) {
    super();
    this.game = game;
    this.width = 60;
    this.height = 44;
    this.image = document.getElementById("enemy_fly");
    this.x = this.game.width + Math.random() * this.game.width * 0.5;
    this.y = Math.random() * this.game.height * 0.7;
    this.speedX = Math.random() + 1;
    this.speedY = 0;
    this.maxFrame = 5;
    this.angle = 0;
    this.va = Math.random() * 0.1 + 0.1;
    this.canBeKilled = true;
  }
  update(deltaTime) {
    super.update(deltaTime);
    this.angle += this.va;
    this.y += Math.sin(this.angle);
  }
}

export class PlantEnemy extends Enemy {
  constructor(game) {
    super();
    this.game = game;
    this.width = 120.125;
    this.height = 90;
    this.image = document.getElementById("enemy_ground");
    this.x = this.game.width;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.speedX = 0;
    this.speedY = 0;
    this.maxFrame = 7;
    this.canBeKilled = false;
  }
}

export class SpiderEnemy extends Enemy {
  constructor(game) {
    super();
    this.game = game;
    this.width = 120;
    this.height = 144;
    this.image = document.getElementById("enemy_spider");
    this.x = this.game.width;
    this.y = Math.random() * this.game.height * 0.5;
    this.speedX = 0;
    this.speedY = Math.random() > 0.5 ? 1 : -1;
    this.maxFrame = 5;
    this.canBeKilled = false;
  }
  update(deltaTime) {
    super.update(deltaTime);
    if (this.y > this.game.height - this.height - this.game.groundMargin) {
      this.speedY *= -1;
    }
    if (this.y < 0 - this.height) this.markForDeletion = true;
  }
  draw(ctx) {
    super.draw(ctx);
    ctx.beginPath();
    ctx.moveTo(this.x + this.width / 2, 0);
    ctx.lineTo(this.x + this.width / 2, this.y + this.height / 3);
    ctx.stroke();
  }
}
