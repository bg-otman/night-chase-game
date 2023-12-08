export class Ui {
  constructor(game) {
    this.game = game;
    this.fontSize = 30;
    this.fillStyle = "black";
    this.fontFamilly = "Creepster";
    this.livesImage = document.getElementById("lives");
  }
  draw(ctx) {
    ctx.save();
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowColor = "white";
    ctx.shadowBlur = 0;
    ctx.font = `${this.fontSize}px ${this.fontFamilly}`;
    ctx.fillStyle = this.fillStyle;
    ctx.textAlign = "left";
    // score
    ctx.fillText(`Score: ${this.game.score}`, 20, 50);
    // Last score
    ctx.fillText(`Your Best score: ${this.game.bestScore}`, 20, 130);
    // lives
    for (let i = 0; i < this.game.lives; i++) {
      ctx.drawImage(this.livesImage, 25 * i + 20, 70, 25, 25);
    }
    // Levels
    ctx.fillText(`Level : ${this.game.level}`, 150, 50);

    // game over
    if (this.game.gameOver) {
      ctx.shadowColor = "black";
      ctx.fillStyle = "rgb(226, 25, 25)";
      ctx.textAlign = "center";
      ctx.font = `${this.fontSize * 2.4}px ${this.fontFamilly}`;
      if (this.game.score > this.game.bestScore) {
        this.game.bestScore = this.game.score;
        localStorage.setItem("bestScore", JSON.stringify(this.game.bestScore));
        ctx.fillText(
          "You can do better!",
          this.game.width * 0.5,
          this.game.height * 0.5 - 20
        );
        ctx.font = `${this.fontSize}px ${this.fontFamilly}`;
        ctx.fillText(
          "Try to beat your last score, Press Enter",
          this.game.width * 0.5,
          this.game.height * 0.5 + 20
        );
      } else {
        ctx.font = `${this.fontSize * 1.9}px ${this.fontFamilly}`;
        ctx.fillText(
          "Creatures got you!",
          this.game.width * 0.5,
          this.game.height * 0.5 - 20
        );
        ctx.font = `${this.fontSize}px ${this.fontFamilly}`;
        ctx.fillText(
          "Try your luck again! Press Enter",
          this.game.width * 0.5,
          this.game.height * 0.5 + 20
        );
      }
    }
    ctx.restore();
  }
}
