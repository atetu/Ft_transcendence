import Container from "typedi";
import * as socketio from "socket.io";
import User from "../entities/User";

class Paddle {
  constructor(public x: number, public y: number) {}
}

class Ball {
  constructor(
    public x: number,
    public y: number,
    public xSpeed: number,
    public ySpeed: number
  ) {}

  update() {}

  collide(paddle: Paddle): boolean {
    return false;
  }
}

export default class Game {
  private interval?: ReturnType<typeof setInterval>;
  private users: User[]

  constructor() {}

  start() {
    if (this.interval === undefined) {
      this.interval = setInterval(() => this.loop(), 1000 / 20);
    }
  }

  stop() {
    if (this.interval !== undefined) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
  }

  loop() {
    console.log(1);

    const io = Container.get(socketio.Server)
    io.to('game_1').emit('game_state', {
      paddle: 1,
      score: 1
    })
  }

  movePaddle(user: User, y: number) {}
}

const game = new Game();
game.start();
