import { Dust, Fire, Splash } from "./particles.js";

const states = {
  SETTING: 0,
  RUNING: 1,
  JUMPING: 2,
  FALLING: 3,
  ROLLING: 4,
  DIVING: 5,
  HIT: 6,
};

class State {
  constructor(state, game) {
    this.state = state;
    this.game = game;
  }
}

export class Setting extends State {
  constructor(game) {
    super("SETTING", game);
  }
  enter() {
    this.game.player.frameX = 0;
    this.game.player.frameY = 5;
    this.game.player.maxFrame = 4;
  }
  handleInput(inputs) {
    if (inputs.includes("ArrowRight") || inputs.includes("ArrowLeft")) {
      this.game.player.setState(states.RUNING, 1);
    } else if (inputs.includes(" ")) {
      this.game.player.setState(states.ROLLING, 2);
    } else if (inputs.includes("ArrowUp")) {
      this.game.player.setState(states.JUMPING, 1);
    }
  }
}

export class Runing extends State {
  constructor(game) {
    super("RUNING", game);
  }
  enter() {
    this.game.player.frameX = 0;
    this.game.player.frameY = 3;
    this.game.player.maxFrame = 8;
  }
  handleInput(inputs) {
    this.game.particles.unshift(
      new Dust(
        this.game,
        this.game.player.x + this.game.player.width * 0.5,
        this.game.player.y + this.game.player.height
      )
    );
    if (inputs.includes("ArrowDown")) {
      this.game.player.setState(states.SETTING, 0);
    } else if (inputs.includes("ArrowUp")) {
      this.game.player.setState(states.JUMPING, 1);
    } else if (inputs.includes(" ")) {
      this.game.player.setState(states.ROLLING, 2);
    }
  }
}

export class Jumping extends State {
  constructor(game) {
    super("JUMPING", game);
  }
  enter() {
    if (this.game.player.onGround()) this.game.player.vy -= 25;
    this.game.player.frameX = 0;
    this.game.player.frameY = 1;
    this.game.player.maxFrame = 6;
  }
  handleInput(inputs) {
    if (this.game.player.vy > this.game.player.gravity) {
      this.game.player.setState(states.FALLING, 1);
    } else if (inputs.includes(" ")) {
      this.game.player.setState(states.ROLLING, 2);
    } else if (inputs.includes("ArrowDown")) {
      this.game.player.setState(states.DIVING, 0);
    }
  }
}

export class Falling extends State {
  constructor(game) {
    super("FALLING", game);
  }
  enter() {
    this.game.player.frameX = 0;
    this.game.player.frameY = 2;
    this.game.player.maxFrame = 6;
  }
  handleInput(inputs) {
    if (this.game.player.onGround()) {
      this.game.player.setState(states.RUNING, 1);
    } else if (inputs.includes("ArrowDown")) {
      this.game.player.setState(states.DIVING, 0);
    }
  }
}

export class Rolling extends State {
  constructor(game) {
    super("ROLLING", game);
  }
  enter() {
    this.game.player.frameX = 0;
    this.game.player.frameY = 6;
    this.game.player.maxFrame = 6;
  }
  handleInput(inputs) {
    this.game.particles.unshift(
      new Fire(
        this.game,
        this.game.player.x + this.game.player.width * 0.6,
        this.game.player.y + this.game.player.height * 0.5
      )
    );

    if (
      inputs.includes("ArrowUp") &&
      this.game.player.onGround() &&
      inputs.includes(" ")
    ) {
      this.game.player.setState(states.JUMPING, 1);
    } else if (!inputs.includes(" ") && !this.game.player.onGround()) {
      this.game.player.setState(states.FALLING, 1);
    } else if (!inputs.includes(" ") && this.game.player.onGround()) {
      this.game.player.setState(states.RUNING, 1);
    } else if (inputs.includes("ArrowDown") && !this.game.player.onGround()) {
      this.game.player.setState(states.DIVING, 0);
    }
  }
}

export class Diving extends State {
  constructor(game) {
    super("DIVING", game);
  }
  enter() {
    this.game.player.frameX = 0;
    this.game.player.frameY = 6;
    this.game.player.maxFrame = 6;
    this.game.player.vy = 15;
    this.divingSound = new Audio("../sounds/special-move-sound.mp3");

    this.divingSound.addEventListener("canplaythrough", () => {
      if (this.game.soundOn) this.divingSound.play();
    });
  }
  handleInput(inputs) {
    this.game.particles.unshift(
      new Fire(
        this.game,
        this.game.player.x + this.game.player.width * 0.6,
        this.game.player.y + this.game.player.height * 0.5
      )
    );

    if (inputs.includes(" ") && this.game.player.onGround()) {
      this.game.player.setState(states.ROLLING, 2);
    } else if (this.game.player.onGround()) {
      this.game.player.setState(states.RUNING, 1);
      for (let i = 0; i < 30; i++) {
        this.game.particles.unshift(
          new Splash(
            this.game,
            this.game.player.x + this.game.player.width * 0.6,
            this.game.player.y + this.game.player.height * 0.5
          )
        );
      }
    }
  }
}

export class Hit extends State {
  constructor(game) {
    super("HIT", game);
  }
  enter() {
    this.game.player.frameX = 0;
    this.game.player.maxFrame = 10;
    this.game.player.frameY = 4;
  }
  handleInput(inputs) {
    if (
      this.game.player.frameX >= this.game.player.maxFrame &&
      this.game.player.onGround()
    ) {
      this.game.player.setState(states.RUNING, 1);
    } else if (
      this.game.player.frameX >= this.game.player.maxFrame &&
      !this.game.player.onGround()
    ) {
      this.game.player.setState(states.FALLING, 1);
    }
  }
}
