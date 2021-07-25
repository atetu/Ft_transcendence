import * as socketio from "socket.io";
import { Container } from "typedi";
import Match from "../entities/Match";
import User from "../entities/User";
import AchievementProgressService from "../services/AchievementProgressService";
import GameService from "../services/GameService";
import MatchService from "../services/MatchService";
import UserStatisticsService from "../services/UserStatisticsService";
import Achievements from "./Achievements";
import { Ball } from "./Ball";
import { COLLISION_STEP, HEIGHT, WIDTH } from "./Constants";
import { Direction, Side } from "./Enums";
import { Map } from "./Map";
import Maps from "./Maps";
import { Paddle } from "./Paddle";
import { Player } from "./Player";
import { defaults as defaultsGameSettings, GameSettings } from "./Settings";
import { CollisionResult, Rectangle } from "./Shape";
import { World } from "./World";

function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export default class Game {
  public id: number | null = null;

  private interval?: ReturnType<typeof setInterval>;

  private ball: Ball = new Ball(0, 0, 3.5, 1.5);
  private direction: Direction;

  private paddle = {
    [Side.LEFT]: new Paddle(15, 10),
    [Side.RIGHT]: new Paddle(770, 10),
  };

  private player = {
    [Side.LEFT]: null as Player,
    [Side.RIGHT]: null as Player,
  };

  private world = new World();
  private map: Map;

  public countdown: number = 3;
  public settings: GameSettings;

  public matchService = Container.get(MatchService);
  public userStatisticsService = Container.get(UserStatisticsService);
  public achievementProgressService = Container.get(AchievementProgressService);
  public gameService = Container.get(GameService);

  public waitingRoom: User[] = new Array(2);
  public waitingRoomOption: number[] = new Array(2);
  private leaving: Array<User>;

  constructor(
    first: socketio.Socket,
    second: socketio.Socket,
    settings?: GameSettings
  ) {
    this.settings = settings || defaultsGameSettings();
    this.map = Maps.find(this.settings.map);
    this.leaving = [];

    this.player[Side.LEFT] = new Player(first);
    this.player[Side.RIGHT] = new Player(second);

    this.direction = this.nextDirection();
    this.ball.setDirection(this.direction);

    this.paddle[Side.LEFT].toMiddleOf(HEIGHT);
    this.paddle[Side.RIGHT].toMiddleOf(HEIGHT);

    this.repositionBall();
  }

  start() {
    const io = Container.get(socketio.Server);

    io.to(this.toRoom()).emit("game_connect", this.toJSON());

    if (this.interval === undefined) {
      this.interval = setInterval(() => this.loop(), 1000 / 20);
    }

    this.decount();
  }

  repositionBall() {
    this.ball.x = WIDTH / 2;
    this.ball.y = getRandomArbitrary(250, 350);
  }

  restart() {
    this.repositionBall();

    this.direction = this.nextDirection();
    this.ball.setDirection(this.direction);
    this.countdown = 3;

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

  handleBallCollision(rectanble: Rectangle, nextDirection: Direction) {
    const result = rectanble.collide(this.ball);

    if (
      result === CollisionResult.HORIZONTAL ||
      result === CollisionResult.BOTH
    ) {
      this.ball.yVelocity *= -1;
    }

    if (
      result === CollisionResult.VERTICAL ||
      result === CollisionResult.BOTH
    ) {
      this.ball.xVelocity *= -1;

      this.direction = nextDirection;

      // console.log(
      //   {
      //     [CollisionResult.NONE]: "none",
      //     [CollisionResult.HORIZONTAL]: "hor",
      //     [CollisionResult.VERTICAL]: "ver",
      //     [CollisionResult.BOTH]: "both",
      //   }[result]
      // );
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

      if (this.direction == Direction.RIGHT) {
        this.handleBallCollision(this.paddle[Side.RIGHT], Direction.LEFT);
      }

      if (this.direction == Direction.LEFT) {
        this.handleBallCollision(this.paddle[Side.LEFT], Direction.RIGHT);
      }

      for (const obstacle of this.map.obstacles) {
        this.handleBallCollision(
          obstacle,
          this.direction == Direction.LEFT ? Direction.RIGHT : Direction.LEFT
        );
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
    await this.matchService.save(match);

    if (winner == this.player[Side.LEFT]) {
      await this.userStatisticsService.incrementWinCount(
        this.player[Side.LEFT].user
      );
      await this.userStatisticsService.incrementWinCount(
        this.player[Side.LEFT].user
      );
    } else {
      await this.userStatisticsService.incrementWinCount(
        this.player[Side.RIGHT].user
      );
      await this.userStatisticsService.incrementLossCount(
        this.player[Side.LEFT].user
      );
    }

    console.log(match);
    io.to(this.toRoom()).emit("game_end", match);

    try {
      await this.achievementProgressService.increment(
        Achievements.FIRST_TIME,
        winner.user
      );
      await this.achievementProgressService.increment(
        Achievements.KING_OF_THE_HILL,
        winner.user
      );
      await this.achievementProgressService.increment(
        Achievements.AT_WHAT_COST,
        winner.user
      );

      for (const user of this.users) {
        await this.achievementProgressService.increment(
          Achievements.BEGINNER,
          user
        );
        await this.achievementProgressService.increment(
          Achievements.INTERMEDIATE,
          user
        );
        await this.achievementProgressService.increment(
          Achievements.GAMER,
          user
        );
        await this.achievementProgressService.increment(
          Achievements.GO_OUTSIDE,
          user
        );
      }
    } catch (error) {
      console.log(error);
    }

    this.gameService.delete(this);
    // TODO : enregistrer infos match
    // envoyer infos au front pour dire que c'est la fin des fins
  }

  loop() {
    const io = Container.get(socketio.Server);

    if (this.countdown === -1 && this.updateBall() === 0) {
      clearInterval(this.interval);

      let scorer: Player;
      if (this.direction == Direction.LEFT) {
        scorer = this.player[Side.RIGHT];
      } else {
        scorer = this.player[Side.LEFT];
      }

      scorer.score++;

      if (scorer.score === this.settings.nbGames) {
        this.stopGame(scorer);
        return;
      }

      io.to(this.toRoom()).emit("game_scored", {
        ...this.toJSON(),
        scorer,
      });

      clearInterval(this.interval);

      setTimeout(() => this.restart(), 1000);
    }

    io.to(this.toRoom()).emit("game_state", this.toJSON());
  }

  async decount() {
    while (this.countdown != -1) {
      await sleep(800);
      this.countdown--;
    }
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

  get players(): [Player, Player] {
    return [this.player[Side.LEFT], this.player[Side.RIGHT]];
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
      countdown: this.countdown,
      map: this.map,
      factor: this.settings.paddleVelocity,
      settings: this.settings,
    };
  }

  public toRoom(): string {
    return `game_${this.id}`;
  }
}
