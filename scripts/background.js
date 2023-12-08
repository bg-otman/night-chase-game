class Layer {
  constructor(game, width, height, speedModifier, image) {
    this.game = game;
    this.width = width;
    this.height = height;
    this.image = image;
    this.speedModifier = speedModifier;
    this.x = 0;
    this.y = 0;
  }
  update() {
    if (this.x < -this.width) this.x = 0;
    else this.x -= this.speedModifier * this.game.speed;
  }
  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    ctx.drawImage(
      this.image,
      this.x + this.width,
      this.y,
      this.width,
      this.height
    );
  }
}

export class Background {
  constructor(game) {
    this.game = game;
    this.width = 1667;
    this.height = 500;
    this.layer1Img = document.getElementById("layer1");
    this.layer2Img = document.getElementById("layer2");
    this.layer3Img = document.getElementById("layer3");
    this.layer4Img = document.getElementById("layer4");
    this.layer5Img = document.getElementById("layer5");
    this.layer1 = new Layer(game, this.width, this.height, 0, this.layer1Img);
    this.layer2 = new Layer(game, this.width, this.height, 0.2, this.layer2Img);
    this.layer3 = new Layer(game, this.width, this.height, 0.4, this.layer3Img);
    this.layer4 = new Layer(game, this.width, this.height, 0.8, this.layer4Img);
    this.layer5 = new Layer(game, this.width, this.height, 1, this.layer5Img);
    this.backrgound = [
      this.layer1,
      this.layer2,
      this.layer3,
      this.layer4,
      this.layer5,
    ];
  }
  update() {
    this.backrgound.forEach((layer) => {
      layer.update();
    });
  }
  draw(ctx) {
    this.backrgound.forEach((layer) => {
      layer.draw(ctx);
    });
  }
}
