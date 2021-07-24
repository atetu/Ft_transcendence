<template>
  <!-- Canvas -->

  <!-- <v-main> -->

  <v-container fill-height>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <!-- <template #activator="{ on, attrs }">
      <v-btn v-if="small" icon color="primary" v-bind="attrs" v-on="on">
        <v-icon>mdi-sword-cross</v-icon>
      </v-btn>
      <v-btn v-else color="primary" v-bind="attrs" v-on="on" @click="dialog = true">
        challenge
        <v-icon right>mdi-sword-cross</v-icon>
      </v-btn>
    </template> -->
      <v-card height="200" class="text-center">
        <v-card-title>
          <v-row class="fill-height" justify="center" align="center">
            <v-col cols="12">
              <p font-size="xx-large">Your partner has left the game.</p>
              <p font-size="normal">You will be redirected to the home page.</p>
            </v-col>
          </v-row>
        </v-card-title>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="quit">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row>
      <v-col cols="1" align="center" justify="center">
        <template v-if="leftPlayer">
        <user-avatar :user="leftPlayer.user" />
        <p class="login">{{ leftPlayer.user.username }}</p>
        <p class="score">{{ leftPlayer.score }}</p>
        <p>
          <v-btn
            v-if="status === 3"
            :disabled="activeBtn == true"
            elevation="2"
            :color="primary"
            @click="restart"
          >
            RESTART</v-btn
          >
        </p>
        </template>
      </v-col>

      <v-col cols="10">
        <canvas
          id="myCanvas"
          :width="width"
          :height="height"
          tabindex="0"
          @keydown="onKeyDown"
          @keyup="onKeyUp"
          style="position: absolute"
        ></canvas>
      </v-col>
      <v-col cols="1" align="center" justify="center">
        <template v-if="rightPlayer">
          <user-avatar :user="rightPlayer.user" />
          <p class="login">{{ rightPlayer.user.username }}</p>
          <p class="score">{{ rightPlayer.score }}</p>
          <p>
            <v-btn
              v-if="status === 3"
              :disabled="activeBtn == true"
              elevation="2"
              :color="primary"
              @click="restart"
            >
              RESTART</v-btn
            >
          </p>
        </template>
      </v-col>
    </v-row>
  </v-container>
  <!-- </v-main> -->

  <!-- Add Rectangle Button -->
</template>

<style>
  #myCanvas {
    position: absolute;
    padding: 0;
    margin: auto;
    display: block;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 50%;
    border: 1px solid black;
  }

  #custom-disabled.v-btn--disabled {
    background-color: red !important;
  }

  .score {
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: 80px;
  }

  .login {
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: 20px;
  }
</style>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator' // propre a nuxt
import { Socket } from 'vue-socket.io-extended'
import { User } from '~/models'
import { Game, Player, Side } from '~/models/Game'

enum Status {
  waiting = 1,
  playing = 2,
  over = 3,
}

enum setStatusEnum {
  playing = 1,
  over = 2,
}

class Sprite {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number
  ) {}
}

class VisibleObject {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number
  ) {}

  copyPosition({ x, y }: { x: number; y: number }) {
    this.x = x
    this.y = y
  }

  updatePosition(x: number, y: number) {
    this.x = x
    this.y = y
  }

  draw(ctx: CanvasRenderingContext2D) {
    /* empty */
  }
}

class Paddle extends VisibleObject {
  constructor(x: number, y: number) {
    super(x, y, 20, 100)
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'white'
    ctx.fillRect(this.x, this.y, 20, 100)
  }
}

class Ball extends VisibleObject {
  constructor(x: number, y: number) {
    super(x, y, 15, 15)
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2)
    ctx.fillStyle = 'white'
    ctx.fill()
    ctx.closePath()
  }
}

@Component
export default class Page extends Vue {
  dialog = false
  canvas: HTMLCanvasElement | null = null
  ctx: CanvasRenderingContext2D | null = null

  private loopInterval: NodeJS.Timeout | null = null

  height: number = 600
  width: number = 800

  ball = new Ball(300, 200)

  paddle = {
    [Side.LEFT]: new Paddle(15, 10),
    [Side.RIGHT]: new Paddle(770, 10),
  }

  player = {
    [Side.LEFT]: null as unknown as Player,
    [Side.RIGHT]: null as unknown as Player,
  }

  side: Side = Side.LEFT

  over: boolean = false
  start: boolean = true
  message: string = ''
  timer: number = 3
  playing: boolean = false
  user: User | null = null
  status: Status = Status.waiting
  winner: User | null = null
  setStatus: setStatusEnum = setStatusEnum.playing
  roundWinner: number = 1
  sprite: Sprite | null = null
  activeBtn: boolean = true
  primary = this.$vuetify.theme.themes.dark.primary
  velPaddle: number = 4
  factor: number = 1
  block: boolean = false

  keys = {
    up: false,
    down: false,
  }

  get id() {
    return this.$route.params.id
  }

  onKeyDown(event: KeyboardEvent) {
    if (!this.inputEnabled) {
      return
    }

    switch (event.key) {
      case 'ArrowDown': {
        this.keys.down = true
        break
      }

      case 'ArrowUp': {
        this.keys.up = true
        break
      }
    }
  }

  onKeyUp(event: KeyboardEvent) {
    if (!this.inputEnabled) {
      return
    }

    switch (event.key) {
      case 'ArrowDown': {
        this.keys.down = false
        break
      }

      case 'ArrowUp': {
        this.keys.up = false
        break
      }
    }
  }

  get inputEnabled(): boolean {
    return this.status === Status.playing && !this.block
  }

  restart() {
    this.activeBtn = false
    this.$socket.client.emit('game_restart', {
      gameId: this.id,
      option: 0,
    })
  }

  updatePaddles() {
    if (
      this.player[Side.LEFT].user.id === this.$store.state.auth.user.id ||
      this.player[Side.RIGHT].user.id === this.$store.state.auth.user.id
    ) {
      const paddle = this.myPaddle

      let newY = paddle.y
      const prevY = newY

      if (this.keys.up && !this.keys.down) {
        newY += this.velPaddle * -1 * this.factor
      } else if (this.keys.down && !this.keys.up) {
        newY += this.velPaddle * this.factor
      }

      if (newY !== prevY) {
        paddle.y = newY

        this.$socket.client.emit(
          'game_move',
          {
            gameId: this.id,
            y: newY,
          },
          (err: any) => {
            if (err) {
              paddle.y = prevY
            }
          }
        )
      }
    }
  }

  get myPaddle(): Paddle {
    return this.paddle[this.side]
  }

  mounted() {
    this.canvas = <HTMLCanvasElement>document.getElementById('myCanvas')
    this.ctx = <CanvasRenderingContext2D>this.canvas.getContext('2d')
    this.ctx.fillStyle = `${this.$vuetify.theme.themes.dark.primary}`
    this.ctx.fillRect(0, 0, this.width, this.height)

    this.$socket.client.emit(
      'game_connect',
      {
        gameId: this.id,
      },
      (error: any, body: Game) => {
        if (!error) {
          const { player, ball, paddle, countdown } = body

          if (player[Side.LEFT].user.id === this.$store.state.auth.user.id) {
            this.side = Side.LEFT
          } else {
            this.side = Side.RIGHT
          }

          this.player = player

          this.ball.copyPosition(ball)
          this.paddle[Side.LEFT].copyPosition(paddle[Side.LEFT])
          this.paddle[Side.RIGHT].copyPosition(paddle[Side.RIGHT])

          this.timer = countdown

          this.loopInterval = setInterval(() => this.loop(), 1000 / 60)
        }
      }
    )
  }

  beforeDestroy() {
    this.$socket.client.emit('game_disconnect')

    if (this.loopInterval) {
      clearInterval(this.loopInterval)
      this.loopInterval = null
    }
  }

  loop(): void {
    if (!this.ctx) {
      return
    }

    this.ctx.fillStyle = `${this.$vuetify.theme.themes.dark.primary}`
    this.ctx.fillRect(0, 0, this.width, this.height)

    if (this.status !== Status.over) {
      if (this.sprite != null) {
        this.ctx.fillStyle = 'white'
        this.ctx.fillRect(
          this.sprite.x,
          this.sprite.y,
          this.sprite.width,
          this.sprite.height
        )
      }
      this.ball.draw(this.ctx)

      this.ctx.strokeStyle = 'grey'
      this.ctx.moveTo(400, 20)
      this.ctx.lineTo(400, 580)
      this.ctx.stroke()

      this.updatePaddles()
      this.paddle[Side.LEFT].draw(this.ctx)
      this.paddle[Side.RIGHT].draw(this.ctx)

      if (this.status === Status.waiting) {
        this.ctx.font = '80px Nunito'
        this.ctx.fillStyle = 'white'
        this.ctx.textAlign = 'center'
        this.ctx.fillText('' + this.timer, this.width / 2, this.height / 2)
      }
    } else {
      if (this.setStatus === setStatusEnum.over) {
        this.ctx.font = '80px Nunito'
        this.ctx.fillStyle = 'white'
        this.ctx.textAlign = 'center'
        this.ctx.fillText(this.message, this.width / 2, this.height / 2)
      } else if (this.status === Status.over) {
        this.ctx.font = '80px Nunito'
        this.ctx.fillStyle = 'white'
        this.ctx.textAlign = 'center'
        this.ctx.fillText('GAME OVER', this.width / 2, this.height / 2)
      }
    }
  }

  get gameOver() {
    if (this.status != 3) return null
    if (this.setStatus === 1) return 'GAME OVER'
    else return this.winner?.username + 'wins !'
  }

  quit() {
    // this.dialog = false
    this.$router.push({ path: `/` })
  }

  @Socket('game_state')
  onGameState(data: Game) {
    const { paddle, ball, countdown, sprite, factor } = data

    this.ball.copyPosition(ball)

    this.paddle[Side.LEFT].y = paddle[Side.LEFT].y
    this.paddle[Side.RIGHT].y = paddle[Side.RIGHT].y

    this.timer = countdown
    this.sprite = sprite
    this.factor = factor

    if (this.timer === 3) {
      this.status = Status.waiting
    }

    this.activeBtn = true

    if (this.timer === -1 && this.status === Status.waiting) {
      this.status = Status.playing
      this.activeBtn = true
    }
  }

  // @Socket('game_over')
  // finishGame(data: any) {
  //   const { score1, score2 } = data
  //   var prev_score1 = this.score1
  //   this.score1 = score1
  //   this.score2 = score2
  //   if (this.score1 > prev_score1) this.roundWinner = 1
  //   else this.roundWinner = 2
  //   this.status = Status.over
  // }

  // @Socket('set_over')
  // finishSet(data: any) {
  //   console.log('SET OVER')
  //   this.setStatus = setStatusEnum.over
  //   this.status = Status.over
  //   const { winner, score1, score2 } = data
  //   this.winner = winner
  //   if (this.winner !== null) this.message = this.winner.username + ' wins!'
  //   this.score1 = score1
  //   this.score2 = score2
  // }

  @Socket('game_exit')
  async gameExit(data: any) {
    console.log('GAME EXIT')
    this.block = true
    this.dialog = true
    console.log('block')
  }

  get leftPlayer(): Player {
    return this.player[Side.LEFT]
  }

  get rightPlayer(): Player {
    return this.player[Side.RIGHT]
  }
}
</script>
