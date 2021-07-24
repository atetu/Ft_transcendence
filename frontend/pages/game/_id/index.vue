<template>
  <v-container fill-height>
    <v-row>
      <v-col cols="1" align="center" justify="center">
        {{ state }}
        <game-score v-if="leftPlayer" :player="leftPlayer" />
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
        <game-score v-if="rightPlayer" :player="rightPlayer" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator' // propre a nuxt
import { Socket } from 'vue-socket.io-extended'
import { Match, User } from '~/models'
import { Game, Player, Side } from '~/models/Game'

enum State {
  WAITING,
  PLAYING,
  SCORED,
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
  destroyed = true
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

  message: string = ''
  countdown: number = 3
  state = State.WAITING
  sprite: Sprite | null = null
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

  loop(): void {
    if (!this.ctx) {
      return
    }

    this.ctx.fillStyle = `${this.$vuetify.theme.themes.dark.primary}`
    this.ctx.fillRect(0, 0, this.width, this.height)

    this.ctx.strokeStyle = 'grey'
    this.ctx.moveTo(400, 20)
    this.ctx.lineTo(400, 580)
    this.ctx.stroke()

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
    if (this.state === State.PLAYING) {
      this.updatePaddles()
    }
    this.paddle[Side.LEFT].draw(this.ctx)
    this.paddle[Side.RIGHT].draw(this.ctx)

    switch (this.state) {
      case State.WAITING: {
        this.ctx.font = '80px Nunito'
        this.ctx.fillStyle = 'white'
        this.ctx.textAlign = 'center'
        this.ctx.fillText('' + this.countdown, this.width / 2, this.height / 2)

        break
      }

      case State.SCORED: {
        this.ctx.font = '80px Nunito'
        this.ctx.fillStyle = 'white'
        this.ctx.textAlign = 'center'
        this.ctx.fillText(this.message, this.width / 2, this.height / 2)

        break
      }
    }
  }

  @Socket('game_state')
  onGameState(data: Game) {
    const { paddle, ball, countdown, sprite, factor } = data

    this.ball.copyPosition(ball)

    this.paddle[Side.LEFT].y = paddle[Side.LEFT].y
    this.paddle[Side.RIGHT].y = paddle[Side.RIGHT].y

    this.countdown = countdown
    this.sprite = sprite
    this.factor = factor

    if (countdown !== -1) {
      this.state = State.WAITING
    } else if (this.state !== State.PLAYING) {
      this.state = State.PLAYING
    }
  }

  @Socket('game_scored')
  onGameScored(data: Game) {
    const { scorer } = data

    this.message = `${scorer!.user.username} scored!`
    this.state = State.SCORED
  }

  @Socket('game_end')
  onGameEnd(match: Match) {
    this.$router.push({
      path: `/matches/${match.id}`,
    })
  }

  @Socket('game_exit')
  async onGameExit(data: any) {
    await this.$dialog.info({
      text: 'game exit',
    })

    this.$router.push({
      path: `/`,
    })
  }

  mounted() {
    this.destroyed = false

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

          this.countdown = countdown

          this.loopInterval = setInterval(() => this.loop(), 1000 / 60)
        }
      }
    )
  }

  beforeDestroy() {
    this.destroyed = true
    this.$socket.client.emit('game_disconnect')

    if (this.loopInterval) {
      clearInterval(this.loopInterval)
      this.loopInterval = null
    }
  }

  get inputEnabled(): boolean {
    return this.state === State.PLAYING && !this.block
  }

  get leftPlayer(): Player {
    return this.player[Side.LEFT]
  }

  get rightPlayer(): Player {
    return this.player[Side.RIGHT]
  }
}
</script>

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
</style>
