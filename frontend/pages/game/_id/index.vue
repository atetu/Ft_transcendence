<template>
  <!-- Canvas -->

  <!-- <v-main> -->
  <v-container fill-height>
    <v-row>
      <v-col cols="1" align="center" justify="center">
        <user-avatar v-if="player1" :user="player1" />
        <p class="login" v-if="player1">{{ player1.username }}</p>
        <p class="score">{{ this.score1 }}</p>
      </v-col>

      <v-col cols="10">
        <canvas
          id="myCanvas"
          :width="width"
          :height="height"
          tabindex="0"
          @keydown="onPressed"
          style="position: absolute"
        ></canvas>
      </v-col>
      <v-col cols="1" align="center" justify="center">
        <user-avatar v-if="player2" :user="player2" />
        <p class="login" v-if="player2">{{ player2.username }}</p>
        <p class="score">{{ this.score2 }}</p>
        <v-btn v-if="status === 3" :disabled="true" elevation="2" :color="x ? 'primary' : 'green'"
        @click="restart"
        > RESTART</v-btn>
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

enum Status {
  waiting = 1,
  playing = 2,
  over = 3,
}

enum setStatusEnum {
  playing,
  over,
}

@Component
export default class Game extends Vue {
  x = true

  canvas: HTMLCanvasElement | null = null
  ctx: CanvasRenderingContext2D | null = null

  private autoSaveInterval: NodeJS.Timeout | null = null
  // private timerInterval: NodeJS.Timeout | null = null

  ballX: number = 300
  ballY = 200
  height: number = 600
  width: number = 800
  up: boolean = false
  down: boolean = false
  paddleLeftX = 15
  paddleLeftY = 10
  paddleRightX = 770
  paddleRightY = 10
  mySide: number = 0
  over: boolean = false
  start: boolean = true
  message: string = ''
  timer: number = 3
  playing: boolean = false
  user: User | null = null
  status: Status = Status.waiting
  player1: User | null = null
  player2: User | null = null
  score1: number = 0
  score2: number = 0
  setStatus: setStatusEnum = setStatusEnum.playing

  get id() {
    return this.$route.params.id
  }

  onPressed(event: KeyboardEvent) {
    // console.log(event.key)
    switch (event.key) {
      case 'ArrowDown': {
        if ((this.status = Status.playing)) {
          this.down = true
          // console.log('down')
          // console.log('myside: ' + this.mySide)
          break
        }
      }
      case 'ArrowUp': {
        if ((this.status = Status.playing)) {
          this.up = true
          break
        }
      }
    }
  }

  restart()
  {
    console.log('restart')
    this.x = false
  }

  update_paddle() {
    // console.log('UPDATE')
    // console.log(this.down)
    let prevY: number = 0
    let Y: number = 0
    let nb: number = 0
    if (this.up) nb = -2
    else if (this.down) nb = 2
    this.up = false
    this.down = false
    if (this.mySide == 1) {
      prevY = this.paddleLeftY
      this.paddleLeftY += nb
      Y = this.paddleLeftY
    } else if (this.mySide == 2) {
      prevY = this.paddleRightY
      this.paddleRightY += nb
      Y = this.paddleRightY
    }
    // console.log('front update: ' + Y)
    if (nb) {
      this.$socket.client.emit(
        'game_move',
        {
          gameId: this.id,
          y: Y,
        },
        (err: any, body: any) => {
          if (err) {
            console.log('error after update')
            if (this.mySide == 1) this.paddleLeftY = prevY
            else this.paddleRightY = prevY
          } else console.log('ok')
        }
      )
    }
  }

  mounted() {
    this.canvas = <HTMLCanvasElement>document.getElementById('myCanvas')
    this.ctx = <CanvasRenderingContext2D>this.canvas.getContext('2d')

    this.$socket.client.emit(
      'game_connect',
      {
        gameId: this.id,
      },
      (error: any, body: any) => {
        if (!error) {
          // console.log('inside error')
          const { player1, player2 } = body
          if (player1.id === this.$store.state.auth.user.id) this.mySide = 1
          else this.mySide = 2
          this.player1 = player1
          this.player2 = player2
        }
        // console.log('MY SIDE: ' + this.mySide)
      }
    )

    this.autoSaveInterval = setInterval(() => this.drawRect(), 1000 / 60)
  }

  drawRect(): void {
    if (this.ctx != null) {
      this.ctx.clearRect(0, 0, this.width, this.height)
      this.ctx.fillStyle = `${this.$vuetify.theme.themes.dark.primary}`
      this.ctx.fillRect(0, 0, this.width, this.height)

      this.ctx.beginPath()
      this.ctx.arc(this.ballX, this.ballY, 15, 0, Math.PI * 2)
      this.ctx.fillStyle = 'white'
      this.ctx.fill()
      this.ctx.closePath()

      this.ctx.strokeStyle = 'grey'
      this.ctx.moveTo(400, 20)
      this.ctx.lineTo(400, 580)
      this.ctx.stroke()

      this.update_paddle()
      this.ctx.fillStyle = 'white'
      this.ctx.fillRect(this.paddleRightX, this.paddleRightY, 20, 100)
      this.ctx.fillStyle = 'white'
      this.ctx.fillRect(this.paddleLeftX, this.paddleLeftY, 20, 100)

      // console.log('status after over and before writing: ' + this.status)
      if (this.status === Status.over) {
        this.ctx.font = '80px Nunito'
        this.ctx.fillStyle = 'white'
        this.ctx.textAlign = 'center'
        this.ctx.fillText('GAME OVER', this.width / 2, this.height / 2)
      }

      if (this.status === Status.waiting) {
        this.ctx.font = '80px Nunito'
        this.ctx.fillStyle = 'white'
        this.ctx.textAlign = 'center'
        this.ctx.fillText('' + this.timer, this.width / 2, this.height / 2)
      }
      //   if (this.timer === -1){
      //  this.playing = true
    }
  }

  @Socket('game_state')
  getDatas(data: any) {
    const { paddle1, paddle2, ballX, ballY, state } = data
    this.ballX = ballX
    this.ballY = ballY

    this.paddleLeftY = paddle1.y

    this.paddleRightY = paddle2.y
    this.timer = state
    if (this.timer === 3) this.status = Status.waiting
    console.log('timer: ' + this.timer)
    if (this.timer === -1 && this.status === Status.waiting) {
      this.status = Status.playing
    }
    // console.log('game statae left: ' + this.paddleLeftY)
    // console.log('game state right: ' + this.paddleRightY)
  }

  @Socket('game_over')
  finishGame(data: any) {
    const { winner, score1, score2, setStatus } = data
    if (winner != null) {
      let winnerFt: User = winner
      this.message = winnerFt.username + ' wins!'
    }
    this.score1 = score1
    this.score2 = score2
    this.setStatus = setStatus
    console.log('OVERRRRR')
    // this.timer = -2
    this.status = Status.over
    console.log('status after over: ' + this.status)
    // if (this.autoSaveInterval)
    //   clearInterval(this.autoSaveInterval)
  }
}
</script>
