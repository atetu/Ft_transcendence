import { Container } from "typedi";
import * as socketio from "socket.io";
import User from "../entities/User";
import MatchService from "../services/MatchService";

import { AdvancedConsoleLogger } from "typeorm";
import Match from "../entities/Match";
import UserStatisticsService from "../services/UserStatisticsService";
import { throws } from "assert";

let nbGames: number = 0;

enum setStatus {
  playing,
  over,
}

class GameObject {
  constructor(public x: number, public y: number) {}
}

class Circle extends GameObject {
  constructor(x: number, y: number, public radius: number) {
    super(x, y);
  }

  get radiusSquare() {
    return Math.pow(this.radius, 2);
  }
}

class Rectangle extends GameObject {
  constructor(
    x: number,
    y: number,
    public width: number,
    public height: number
  ) {
    super(x, y);
  }

  // http://www.jeffreythompson.org/collision-detection/circle-rect.php
  collide(circle: Circle): boolean {
    const { x: cx, y: cy, radius } = circle;
    const { x: rx, y: ry, width: rw, height: rh } = this;

    let testX = cx;
    let testY = cy;

    // which edge is closest?
    if (cx < rx) testX = rx;
    // compare to left edge
    else if (cx > rx + rw) testX = rx + rw; // right edge
    if (cy < ry) testY = ry;
    // top edge
    else if (cy > ry + rh) testY = ry + rh; // bottom edge

    // get distance from closest edges
    const distX = cx - testX;
    const distY = cy - testY;
    const distance = Math.sqrt(distX * distX + distY * distY);

    // if the distance is less than the radius, collision!
    if (distance <= radius) {
      return true;
    }
    return false;
  }
}

class Ball extends Circle {
  constructor(
    x: number,
    y: number,
    public xVelocity: number,
    public yVelocity: number
  ) {
    super(x, y, 15);
  }

  applyVelocity(multiplier: number) {
    this.x += this.xVelocity * multiplier;
    this.y += this.yVelocity * multiplier;
  }

  setDirection(direction: Direction) {
    if (direction === Direction.LEFT && this.xVelocity > 0) {
      this.xVelocity *= -1;
    }

    if (direction === Direction.RIGHT && this.xVelocity < 0) {
      this.xVelocity *= -1;
    }
  }
}

class Paddle extends Rectangle {
  constructor(x: number, y: number) {
    super(x, y, 20, 100);
  }
}

class Sprite extends Rectangle {
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height);
  }
}

class World {
  constructor(
    public readonly topWall: Rectangle,
    public readonly bottomWall: Rectangle,
    public readonly leftWall: Rectangle,
    public readonly rightWall: Rectangle
  ) {}

  collideX(circle: Ball) {
    return this.leftWall.collide(circle) || this.rightWall.collide(circle);
  }

  collideY(circle: Ball) {
    return this.topWall.collide(circle) || this.bottomWall.collide(circle);
  }
}

class Player {
  public readonly user: User;
  public score: number = 0;

  constructor(public socket: socketio.Socket) {
    this.user = socket.data.user;
  }

  setDisconnected() {
    this.socket = null;
  }

  setConnected(socket: socketio.Socket) {
    this.socket = socket;
  }

  get connected(): boolean {
    return !!this.socket;
  }

  public toJSON(): any {
    return {
      user: this.user,
      score: this.score,
      connected: this.connected,
    };
  }
}

export interface GameSettings {
  map: number;
  ballVelocity: number;
  paddleVelocity: number;
  nbGames: number;
}

function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

enum Side {
  LEFT,
  RIGHT,
}

enum Direction {
  LEFT = -1,
  RIGHT = 1,
}

const sprites: Sprite[] = [
  new Sprite(0, 0, 0, 0),
  new Sprite(200, 150, 100, 200),
  new Sprite(600, 300, 50, 200),
  new Sprite(300, 300, 150, 50),
];

const WIDTH = 800;
const HEIGHT = 600;
const WALL_THICKNESS = 100;
const COLLISION_STEP = 3;

export default class Game {
  public id: number | null = null;

  private interval?: ReturnType<typeof setInterval>;

  private ball: Ball = new Ball(300, HEIGHT - 50, 3.5, 1.5);
  private direction: Direction;

  private paddle = {
    [Side.LEFT]: new Paddle(15, 10),
    [Side.RIGHT]: new Paddle(770, 10),
  };

  private player = {
    [Side.LEFT]: null as Player,
    [Side.RIGHT]: null as Player,
  };

  private world = new World(
    new Rectangle(
      -WALL_THICKNESS,
      -WALL_THICKNESS,
      WIDTH + WALL_THICKNESS * 2,
      WALL_THICKNESS
    ),
    new Rectangle(
      -WALL_THICKNESS,
      HEIGHT,
      WIDTH + WALL_THICKNESS * 2,
      WALL_THICKNESS
    ),
    new Rectangle(
      -WALL_THICKNESS,
      -WALL_THICKNESS,
      WALL_THICKNESS,
      HEIGHT + WALL_THICKNESS * 2
    ),
    new Rectangle(
      WIDTH,
      -WALL_THICKNESS,
      WALL_THICKNESS,
      HEIGHT + WALL_THICKNESS * 2
    )
  );

  public connected: number = 0;
  public state: number = 3;
  public status: setStatus = setStatus.playing;
  public sprite: Sprite | null;
  public change: boolean = false;
  public settings: GameSettings;
  public roundNumber: number = 0;
  public matchService = Container.get(MatchService);
  public userStatisticsService = Container.get(UserStatisticsService);
  public waitingRoom: User[] = new Array(2);
  public waitingRoomOption: number[] = new Array(2);
  private leaving: Array<User>;
  private stopIndex: boolean = false;

  constructor(
    first: socketio.Socket,
    second: socketio.Socket,
    settings?: GameSettings
  ) {
    this.settings = settings || {
      map: 0,
      paddleVelocity: 1,
      ballVelocity: 1,
      nbGames: 3,
    };
    this.sprite = sprites[this.settings.map];
    this.leaving = [];

    this.player[Side.LEFT] = new Player(first);
    this.player[Side.RIGHT] = new Player(second);

    this.direction = this.nextDirection();
    this.ball.setDirection(this.direction);
  }

  public toRoom(): string {
    return `game_${this.id}`;
  }

  async decount() {
    while (this.state != -1) {
      await sleep(10);
      this.state--;
    }
  }

  start() {
    const io = Container.get(socketio.Server);

    io.to(this.toRoom()).emit("game_connect", this.toJSON());

    if (this.interval === undefined) {
      this.interval = setInterval(() => this.loop(), 1000 / 20);
    }

    this.decount();
  }

  async restart() {
    this.ball.x = getRandomArbitrary(350, 450);
    this.ball.y = getRandomArbitrary(250, 350);
    this.paddle[Side.LEFT].y = 15;
    this.paddle[Side.RIGHT].y = 15;

    this.direction = this.nextDirection();
    this.ball.setDirection(this.direction);
    this.state = 3;

    this.status = setStatus.playing;
    this.waitingRoomOption.length = 0;
    this.waitingRoom.length = 0;

    this.interval = setInterval(() => this.loop(), 1000 / 20);
    this.decount();
  }

  private nextDirection() {
    return Math.random() >= 0.5 ? Direction.LEFT : Direction.RIGHT;
  }

  stop() {
    if (this.interval != undefined) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
  }

  updateBall() {
    for (let i = 0; i < COLLISION_STEP; i++) {
      if (this.world.collideX(this.ball)) {
        return 0;
      }

      if (this.world.collideY(this.ball)) {
        this.ball.yVelocity *= -1;
      }

      if (
        this.direction == Direction.RIGHT &&
        this.paddle[Side.RIGHT].collide(this.ball)
      ) {
        this.direction = Direction.LEFT;
        this.ball.xVelocity *= -1;
      }

      if (
        this.direction == Direction.LEFT &&
        this.paddle[Side.LEFT].collide(this.ball)
      ) {
        this.direction = Direction.RIGHT;
        this.ball.xVelocity *= -1;
      }

      this.ball.applyVelocity(this.settings.ballVelocity / COLLISION_STEP);
    }

    return 1;
  }

  async stopGame(winner: Player) {
    this.stop();

    const io = Container.get(socketio.Server);

    let match = new Match();
    match.player1 = this.player[Side.LEFT].user;
    match.player2 = this.player[Side.RIGHT].user;
    match.score1 = this.player[Side.LEFT].score;
    match.score2 = this.player[Side.RIGHT].score;
    match.winner = winner.user;
    match = await this.matchService.save(match);

    if (winner == this.player[Side.LEFT]) {
      await this.userStatisticsService.incrementWinCount(
        this.player[Side.LEFT].user
      );
      await this.userStatisticsService.incrementLossCount(
        this.player[Side.RIGHT].user
      );
    } else {
      await this.userStatisticsService.incrementWinCount(
        this.player[Side.RIGHT].user
      );
      await this.userStatisticsService.incrementLossCount(
        this.player[Side.LEFT].user
      );
    }

    io.to(this.toRoom()).emit("game_end", match);
    // TODO : enregistrer infos match
    // envoyer infos au front pour dire que c'est la fin des fins
  }

  loop() {
    const io = Container.get(socketio.Server);

    if (this.state === -1 && this.updateBall() === 0) {
      clearInterval(this.interval);

      let scorer: Player;
      if (this.direction == Direction.LEFT) {
        scorer = this.player[Side.LEFT];
      } else {
        scorer = this.player[Side.RIGHT];
      }

      scorer.score++;
      this.roundNumber++;

      if (this.roundNumber === this.settings.nbGames) {
        this.status = setStatus.over;
        this.stopGame(scorer);
        return;
      }

      io.to(this.toRoom()).emit("game_scored", {
        ...this.toJSON(),
        scorer,
      });

      clearInterval(this.interval);

      setTimeout(() => this.restart(), 500);
    }

    io.to(this.toRoom()).emit("game_state", this.toJSON());
  }

  movePaddle(user: User, y: number) {
    if (y < 0 || y > 500) {
      return false;
    }

    if (user.id == this.player[Side.LEFT].user.id) {
      this.paddle[Side.LEFT].y = y;
    }

    if (user.id == this.player[Side.RIGHT].user.id) {
      this.paddle[Side.RIGHT].y = y;
    }

    return true;
  }

  restartWaitingRoom(player: User, option: number) {
    // console.log('restartWaitingRoom')
    let found: User | null;
    if (this.waitingRoom) {
      found = this.waitingRoom.find(function (element) {
        return element === player;
      });
      // console.log('restartWaitingRoom2')
      if (found === undefined) {
        this.waitingRoom.push(player);
        this.waitingRoomOption.push(option);
        let found2: User | null;
        found2 = this.waitingRoom.find(function (element) {
          return element === player;
        });
        // if (found2 === player)
        //   console.log ('find working')
        // else
        //   console.log ('find not working')
        // console.log ('option : ' + option)
      }
    } else {
      this.waitingRoom.push(player);
      this.waitingRoomOption.push(option);
      // console.log('restartWaitingRoom3 bis')
    }
    if (this.waitingRoom) {
      if (Object.keys(this.waitingRoom).length === 2) return this;
      // console.log('restartWaitingRoom4')
    }
    // console.log('restartWaitingRoom5')
  }

  disconnect(player: User) {
    this.stopIndex = true;
    let found: User | null;
    if (this.leaving && this.leaving.length !== 0) {
      found = this.leaving.find(function (element) {
        return element === player;
      });
      // console.log('restartWaitingRoom2')
      if (found === undefined) {
        this.leaving.push(player);
      }
    } else {
      this.leaving.push(player);
    }
    if (this.leaving !== undefined) {
      if (this.leaving.length === 2) {
        // if (this.winner)
        // {

        // }
        return true;
      }
    }
    return false;
  }

  get users(): [User, User] {
    return [this.player[Side.LEFT].user, this.player[Side.RIGHT].user];
  }

  public toJSON() {
    return {
      id: this.id,
      player: this.player,
      paddle: this.paddle,
      ball: this.ball,
      countdown: this.state,
      sprite: this.sprite,
      factor: this.settings.paddleVelocity,
    };
  }
}
