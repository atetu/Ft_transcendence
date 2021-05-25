import Container from "typedi";
import * as socketio from "socket.io";
import User from "../entities/User";
import UserService from "../services/UserService";
import { AdvancedConsoleLogger } from "typeorm";

class Paddle {
  constructor(public x: number, public y: number) {}

  setY(newY: number){
    this.y = newY
    console.log('newY: ' + this.y)
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
  private users: User[]
  private ball: Ball = new Ball(300, 200, 3, 1)
  private paddle1: Paddle = new Paddle(15, 10)
  private paddle2: Paddle = new Paddle(770, 10)
  private player1: User | null = null
  private player2: User | null = null
  private direction = 1
  private status: string
  private velX: number = 2
  private velY: number = 1
public connected: number = 0

  constructor(
    public id: number,
    
  ) {}

  public toRoom(): string {
    return `game_${this.id}`;
  }
  async setPlayer(nb:number, PlayerId: number)
  {
    const userService = Container.get(UserService);

    if (nb === 1)
    {
      console.log('nb: ' + 1)
      this.player1 = await userService.findById(PlayerId)
      console.log('player1.id: ' + this.player1.id)
    }
    else 
    {
      console.log('nb: ' + 2)

      this.player2 = await userService.findById(PlayerId);
      console.log('player1.id: ' + this.player2.id)

    }
  }

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

  check_collision(x: number, y: number)
  {
    let radius: number = 15
    let dist: number = (x - this.ball.x) * (x - this.ball.x) + (y - this.ball.y) * (y - this.ball.y)
    if (dist <= radius * radius)
      return 1
    return 0
}

  check_up_and_down(x: number, y: number)
  {
    let i: number = x
    while (i <= x + 15)
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
    while (i <= y + 80)
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
    if (this.direction == -1)
    {
      paddle = this.paddle1
      xSide = this.paddle1.x + 20
    }
    else
    {
      paddle = this.paddle2
      xSide = this.paddle1.x
    }
    if (this.check_up_and_down(paddle.x, paddle.y) == 1 || this.check_up_and_down(paddle.x, paddle.y + 100) == 1 || this.check_side(xSide, paddle.y) == 1)
      return 1
    return(0)
  }

  updateBall()
  {
    let radius = 15 * this.direction
    
   
    if ((this.ball.x + radius) <= 0 ||  (this.ball.x + radius) >= 800)
    {  
      this.status = "over"
      return 0
    }
    if ((this.ball.y - radius) <=0 || (this.ball.y + radius) >= 600)
      this.velY*= -1
    
    let ret = this.collision()

    if (ret === 1)
      this.direction*= -1
   
    this.ball.x = this.ball.x + this.velX * this.direction
    this.ball.x = this.ball.x
    this.ball.y = this.ball.y + this.velY * this.direction
    this.ball.y = this.ball.y
    return 1
  }

  loop() {
    // console.log(1);

    const io = Container.get(socketio.Server);
    this.updateBall()
    io.to(this.toRoom()).emit('game_state', {
      paddle1: this.paddle1.y,
      paddle2: this.paddle2.y,
      ballX: this.ball.x,
      ballY: this.ball.y,
    })
  }

  movePaddle(player: User, y: number) {
    console.log('YYYY: ' + y)
    if (y < 0 || y > 800)
      return(false)
    else
    {
      // console.log('player: ' + player.id)
      // console.log('player1: ' + this.player1.id)
      // console.log('player2: ' + this.player2.id)


      if (player.id == this.player1.id)
      {
        // console.log('player1')
        this.paddle1.setY(y)
      }
      else if (player.id == this.player2.id)
      {
        // console.log('player2')

        this.paddle2.setY(y)
      }
    }
    return (true)
  }
}