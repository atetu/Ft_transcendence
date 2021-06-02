import Container from "typedi";
import * as socketio from "socket.io";
import User from "../entities/User";
import UserService from "../services/UserService";
import { AdvancedConsoleLogger } from "typeorm";

let nbGames: number = 0

class Paddle {
  constructor(public x: number, public y: number) {}

  setY(newY: number){
    this.y = newY
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

export default class Game {
  private interval?: ReturnType<typeof setInterval>
  // private users: User[]
  private ball: Ball = new Ball(300, 200, 3, 1)
  private paddle1: Paddle = new Paddle(15, 10)
  private paddle2: Paddle = new Paddle(770, 10)
  // private player1: User | null = null
  // private player2: User | null = null
  private direction: number = 1
  // private status: string
  private velX: number = 2
  private velY: number = 1
  public connected: number = 0
  public id = ++nbGames
  public state: number = 3

  // constructor(
  //   public id: number,
    
  // ) {}

  constructor(
    public player1: User,
    public player2: User,
  ) {}

  public toRoom(): string {
    return `game_${this.id}`;
  }
  // async setPlayer(nb:number, PlayerId: number)
  // {
  //   const userService = Container.get(UserService);

  //   if (nb === 1)
  //   {
  //     // console.log('nb: ' + 1)
  //     this.player1 = await userService.findById(PlayerId)
  //     console.log('player1.id: ' + this.player1.id)
  //   }
  //   else 
  //   {
  //     // console.log('nb: ' + 2)

  //     this.player2 = await userService.findById(PlayerId);
  //     console.log('player2.id: ' + this.player2.id)

  //   }
  // }

  sleep(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  async decount()
  {
    while(this.state != -1)
    {
      await this.sleep(1000);
      this.state--
    }
  }
  
  start() {
    // console.log('start player 1: ' + this.player1.id)
    // console.log('start player 2: ' + this.player2.id)
      const io = Container.get(socketio.Server);

      io.to(this.toRoom()).emit('game_connect', {
      player1: this.player1,
      player2: this.player2
    })
    if (this.interval === undefined) {
      this.interval = setInterval(() => this.loop(), 1000 / 20);
    }
    this.decount()
    console.log('end of start')
  }

  stop() {
    if (this.interval != undefined) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
  }

  check_collision(x: number, y: number)
  {
    let radius: number = 15
    let dist: number = (x - this.ball.x) * (x - this.ball.x) + (y - this.ball.y) * (y - this.ball.y)
    // console.log ('xside : ' + x)
    // console.log ('y : ' + y)
    // console.log ('ballx : ' + this.ball.x)
    // console.log ('bally : ' + this.ball.y)
    // console.log('distance: ' + dist)
    // console.log('radius' + radius)
    if (dist <= radius * radius)
      return 1
    return 0
}

  check_up_and_down(x: number, y: number)
  {
    let i: number = x
    while (i <= x + 20)
    {
      let ret: number = this.check_collision(i, y)
      if (ret === 1)
        return (1)
      i = i + 1
     }
    return 0
    }

  check_side(x: number, y: number)
  {
    let i: number = y
    // console.log('CHECK SIDE')
    // console.log('YYY ' + y)
    while (i <= y + 100)
    {
      let ret: number = this.check_collision(x, i)
  
      if (ret === 1)
        return (1)
     
      i = i + 1
    }
    return(0)
  }

  collision()
  {
    let paddle: Paddle 
    let xSide: number
    // console.log('DIRECTION: ' + this.direction)
    if (this.direction == -1)
    {
      paddle = this.paddle1
      xSide = this.paddle1.x + 20
    }
    else
    {
      // console.log('paddle2: ' + this.paddle2.x)
      // console.log('paddle2y: ' + this.paddle2.y)

      paddle = this.paddle2
      xSide = this.paddle2.x
    }
    // console.log ('xside : ' + xSide)
    // console.log ('ballx : ' + this.ball.x)
    // console.log('paddley: ' + paddle.y)


    if (this.check_up_and_down(paddle.x, paddle.y) === 1 || this.check_up_and_down(paddle.x, paddle.y + 100) === 1 || this.check_side(xSide, paddle.y) === 1)
      return 1
    return(0)
  }

  updateBall()
  {
    let radius = 15 * this.direction
    
   
    if ((this.ball.x + radius) <= 0 ||  (this.ball.x + radius) >= 800)
    {  
      console.log('OVER')
      // this.status = "over"
      return 0
    }
    if ((this.ball.y + radius) <=0 || (this.ball.y - radius) >= 600)
      this.velY*= -1
    
    let ret: number = this.collision()

    if (ret === 1)
      this.direction*= -1
   
    this.ball.x = this.ball.x + this.velX * this.direction
    this.ball.x = this.ball.x
    this.ball.y = this.ball.y + this.velY
    this.ball.y = this.ball.y
    return 1
  }

  loop() {
    // console.log(1);

    const io = Container.get(socketio.Server);
    if (this.state === -1 && this.updateBall() === 0)
    {
      clearInterval(this.interval)
      console.log('OVER BIS')
      io.to(this.toRoom()).emit('game_over')
    }
    // console.log('state: ' + this.state)
    // console.log('player1 before: ' + this.player1.id)
    io.to(this.toRoom()).emit('game_state', {
      player1: this.player1,
      player2: this.player2,
      paddle1: this.paddle1,
      paddle2: this.paddle2,
      ballX: this.ball.x,
      ballY: this.ball.y,
      state: this.state
    })
  }

  movePaddle(player: User, y: number) {
    // console.log('YYYY: ' + y)
    console.log('MOVE PADDLE')
    if (y < 0 || y > 800)
      return(false)
    else
    {
      // console.log('player: ' + player.id)
      // console.log('player1: ' + this.player1.id)
      // console.log('player2: ' + this.player2.id)


      if (player.id == this.player1.id)
      {
        console.log('player1 - paddle1')
        this.paddle1.y = y
        console.log(this.paddle1.y)
      }
      else if (player.id == this.player2.id)
      {
        console.log('player2 - paddle2')

        this.paddle2.y = y
        console.log(this.paddle2.y)

      }
    }
    return (true)
  }
}