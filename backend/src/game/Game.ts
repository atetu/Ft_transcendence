import { Container } from "typedi";
import * as socketio from "socket.io";
import User from "../entities/User";
import MatchService from "../services/MatchService";

import { AdvancedConsoleLogger } from "typeorm";
import Match from "../entities/Match";
import UserStatisticsService from "../services/UserStatisticsService";

let nbGames: number = 0;

enum setStatus {
  playing,
  over,
}

class Paddle {
  constructor(public x: number, public y: number) {}

  setY(newY: number) {
    this.y = newY;
    // console.log('newY: ' + this.y)
  }
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

class Sprite {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number
  ) {}
}

export default class Game {
  private interval?: ReturnType<typeof setInterval>;
  // private users: User[]
  private ball: Ball = new Ball(300, 200, 3, 1);
  private paddle1: Paddle = new Paddle(15, 10);
  private paddle2: Paddle = new Paddle(770, 10);
  // private player1: User | null = null
  // private player2: User | null = null
  private direction: number = 1;
  // private status: string
  private velX: number = 2;
  private velY: number = 1;
  public connected: number = 0;
  public id: number | null = null;
  public state: number = 3;
  public score1: number = 0;
  public score2: number = 0;
  public status: setStatus = setStatus.playing;
  public winner: User;
  public sprite: Sprite | null = null;
  

  public sprites: Sprite[] = new Array(3);


  public matchService = Container.get(MatchService);
  public userStatisticsService = Container.get(UserStatisticsService);
  public waitingRoom: User[] = new Array(2);
  public waitingRoomOption: number[] = new Array(2);



  constructor(public player1: User, public player2: User) {}

  public toRoom(): string {
    return `game_${this.id}`;
  }

  sleep(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  async decount() {
    while (this.state != -1) {
      await this.sleep(1000);
      this.state--;
    }
  }

  start() {
    const io = Container.get(socketio.Server);

    io.to(this.toRoom()).emit("game_connect", {
      player1: this.player1,
      player2: this.player2,
    });
    if (this.interval === undefined) {
      this.interval = setInterval(() => this.loop(), 1000 / 20);
    }
    this.decount();
    console.log("end of start");
  }

  getRandomArbitrary(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }
  
  defineSprite() {
    this.sprite = new Sprite(
      this.getRandomArbitrary(200, 600),
      this.getRandomArbitrary(150, 450),
      this.getRandomArbitrary(50,200),
      this.getRandomArbitrary(50,200)
    )
  }

  async restart() {
    // await this.sleep(3000);
    // if (this.waitingRoomOption)
    // console.log('restartWaitingRoom')
    let found:number = 0
      found = this.waitingRoomOption.find(function (element) {
      return (element === 1);
    });
    console.log('Found: ' + found)
    if (found === 1)
    {
      console.log('sprite found')
      this.defineSprite()
    }

    this.ball.x = this.getRandomArbitrary(200, 400);
    this.ball.y = this.getRandomArbitrary(200, 600);
    this.paddle1.y = 15;
    this.paddle2.y = 10;

    this.direction = this.getRandomInt(1) ? 1 : -1
    this.state = 3;

    this.status = setStatus.playing;
    this.waitingRoomOption.length = 0
    this.waitingRoom.length = 0
    this.interval = setInterval(() => this.loop(), 1000 / 20);
    this.decount();
  }

  stop() {
    if (this.interval != undefined) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
  }

  check_collision(x: number, y: number) {
    let radius: number = 15;
    let dist: number =
      (x - this.ball.x) * (x - this.ball.x) +
      (y - this.ball.y) * (y - this.ball.y);

    if (dist <= radius * radius) return 1;
    return 0;
  }

  check_up_and_down(x: number, y: number) {
    let i: number = x;
    while (i <= x + 20) {
      let ret: number = this.check_collision(i, y);
      if (ret === 1) return 1;
      i = i + 1;
    }
    return 0;
  }

  check_side(x: number, y: number) {
    let i: number = y;
    while (i <= y + 100) {
      let ret: number = this.check_collision(x, i);

      if (ret === 1) return 1;

      i = i + 1;
    }
    return 0;
  }

  collisionSprite()
  {
    let xSide: number;
    if (this.direction == -1) {
      xSide = this.sprite.x + this.sprite.width;
    } else {
      xSide = this.sprite.x;
    }

    if (
      this.check_up_and_down(this.sprite.x, this.sprite.y) === 1 ||
      this.check_up_and_down(this.sprite.x, this.sprite.y + this.sprite.height) === 1 ||
      this.check_side(xSide, this.sprite.y) === 1
    )
      return 1;
  }

  collision() {
    let paddle: Paddle;
    let xSide: number;
    if (this.direction == -1) {
      paddle = this.paddle1;
      xSide = this.paddle1.x + 20;
    } else {
      paddle = this.paddle2;
      xSide = this.paddle2.x;
    }

    if (
      this.check_up_and_down(paddle.x, paddle.y) === 1 ||
      this.check_up_and_down(paddle.x, paddle.y + 100) === 1 ||
      this.check_side(xSide, paddle.y) === 1
    )
      return 1;
    
      if (this.sprite != null)
        this.collisionSprite()
    return 0;
  }

  updateBall() {
    let radius = 15 * this.direction;

    if (this.ball.x + radius <= 0 || this.ball.x + radius >= 800) {
      return 0;
    }
    if (this.ball.y + radius <= 0 || this.ball.y - radius >= 600)
      this.velY *= -1;

    let ret: number = this.collision();

    if (ret === 1) this.direction *= -1;

    this.ball.x = this.ball.x + this.velX * this.direction;
    this.ball.x = this.ball.x;
    this.ball.y = this.ball.y + this.velY;
    this.ball.y = this.ball.y;
    return 1;
  }

  async stopGame() {
    const io = Container.get(socketio.Server);

    let match = new Match();
    match.player1 = this.player1;
    match.player2 = this.player2;
    match.score1 = this.score1;
    match.score2 = this.score2;
    match.winner = this.winner;
    match = await this.matchService.save(match);

    if (this.winner.id == this.player1.id) {
      await this.userStatisticsService.incrementWinCount(this.player1);
      await this.userStatisticsService.incrementLossCount(this.player2);
    } else {
      await this.userStatisticsService.incrementWinCount(this.player2);
      await this.userStatisticsService.incrementLossCount(this.player1);
    }

    io.to(this.toRoom()).emit("set_over");
    // TODO : enregistrer infos match
    // envoyer infos au front pour dire que c'est la fin des fins
  }

  loop() {
    const io = Container.get(socketio.Server);
    if (this.state === -1 && this.updateBall() === 0) {
      clearInterval(this.interval);
      let winner: User | null = null;
      if (this.direction == -1) {
        winner = this.player2;
        this.score2++;
      } else {
        winner = this.player1;
        this.score1++;
      }

      io.to(this.toRoom()).emit("game_over", {
        winner: this.player1,
        score1: this.score1,
        score2: this.score2,
        setStatus: this.status,
      });
      clearInterval(this.interval);
      if (this.score1 === 2 || this.score2 === 2) {
        if (this.score1 === 2) this.winner = this.player1;
        else this.winner = this.player2;
        this.status = setStatus.over;
        this.stopGame();
        return;
      }
      // this.restart();
    }
    io.to(this.toRoom()).emit("game_state", {
      player1: this.player1,
      player2: this.player2,
      paddle1: this.paddle1,
      paddle2: this.paddle2,
      ballX: this.ball.x,
      ballY: this.ball.y,
      state: this.state,
      sprite: this.sprite,
    });
  }

  movePaddle(player: User, y: number) {
    if (y < 0 || y > 500) return false;
    else {
      if (player.id == this.player1.id) {
        console.log("player1 - paddle1");
        this.paddle1.y = y;
        console.log(this.paddle1.y);
      } else if (player.id == this.player2.id) {
        console.log("player2 - paddle2");

        this.paddle2.y = y;
        console.log(this.paddle2.y);
      }
    }
    return true;
  }

  restartWaitingRoom(player: User, option: number) {
    console.log('restartWaitingRoom')
    let found:User | null
    if (this.waitingRoom)
    {
        found = this.waitingRoom.find(function (element) {
        return (element === player);
      });
      console.log('restartWaitingRoom2')
    if (found === undefined)
    {
      this.waitingRoom.push(player)
      this.waitingRoomOption.push(option)
      let found2: User | null
      found2 = this.waitingRoom.find(function (element) {
        return (element === player);
      });
      if (found2 === player)
        console.log ('find working')
      else 
        console.log ('find not working')
      console.log ('option : ' + option)

    }
  }
    else
    {
      this.waitingRoom.push(player)
      this.waitingRoomOption.push(option)
      console.log('restartWaitingRoom3 bis')
    }
    if (this.waitingRoom)
    {
    if (Object.keys(this.waitingRoom).length === 2)
      return this
    console.log('restartWaitingRoom4')
    }
    console.log('restartWaitingRoom5')

  }
}
