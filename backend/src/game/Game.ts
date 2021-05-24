import Container from "typedi";
import * as socketio from "socket.io";
import User from "../entities/User";
import UserService from "../services/UserService";

class Paddle {
  constructor(public x: number, public y: number) {}

  setY(newY: number){
    this.y = newY
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
  private velX: number
  private velY: number


  constructor(
    public id: number,
    public connected: number = 0
  ) {}

  async setPlayer(nb:number, PlayerId: number)
  {
    const userService = Container.get(UserService);

    if (nb === 1)
      this.player1 = await userService.findById(PlayerId);
    else 
      this.player2 = await userService.findById(PlayerId);
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

  collision()
  {
    let paddle: Paddle 
    if (this.direction == -1)
      let paddle = paddle1
    else
      paddle = $redis.get("right:#{@id}")
      x = @canvas_width - 25
      x_side = x
      # side = 1
    end
    # ret1 = check_up_and_down(x, paddle)
    # ret 2 = check_up_and_down(x, paddle.to_f + 80.to_f)
    # ret 3 = 
    if check_up_and_down(x, paddle) == 1.to_i || check_up_and_down(x, paddle.to_f + 80.to_f) == 1.to_i || check_side(x_side.to_f, paddle).to_i == 1.to_f
      # puts "return 1 in collision"
      return 1
    end
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
    console.log(1);

    const io = Container.get(socketio.Server);
    this.updateBall()
    io.to('game' + this.id).emit('game_state', {
      paddle1X: this.paddle1.y,
      paddle2X: this.paddle2.y,
      ballX: this.ball.x,
      ballY: this.ball.y,
      score: 1
    })
  }

  movePaddle(playerId: number, y: number) {
    if (y < 0 || y > 800)
      return(false)
    else
    {
      if (playerId == this.player1.id)
        this.paddle1.setY(y)
      else if (playerId == this.player2.id)
        this.paddle2.setY(y)
    }
  }
}