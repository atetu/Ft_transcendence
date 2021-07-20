<template>
  <!-- Canvas -->

  <!-- <v-main> -->
  <v-container fill-height>
    <v-row>
      <v-col cols="1" align="center" justify="center">
        <user-avatar v-if="player1" :user="player1" />
        <p class="login" v-if="player1">{{ player1.username }}</p>
        <p class="score">{{ this.score1 }}</p>
        <p>
        <v-btn v-if="status === 3" :disabled="(mySide == 1 && activeBtn == true)? false : true" elevation="2" :color= "primary"
        @click="restart"
        > RESTART</v-btn>
        </p>
        <p>
         <v-btn v-if="status === 3 && roundWinner === 1" :disabled="(mySide == 1 && activeBtn == true)? false : true" elevation="1" :color= "primary"
        @click="restart"
        > RESTART WITH OPTIONS</v-btn>
        </p>
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
        <p>
         <v-btn v-if="status === 3" :disabled="(mySide === 2 && activeBtn == true)? false : true" elevation="2" :color= "primary"
        @click="restart"
        > RESTART</v-btn>
        </p>
        <p>
         <v-btn v-if="status === 3 && roundWinner === 2" :disabled="(mySide === 2 && activeBtn == true) ? false : true" elevation="1" :color= "primary"
        @click="restartWithOption"
        > RESTART WITH OPTIONS</v-btn>
        </p>
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
  winner: User | null = null
  score1: number = 0
  score2: number = 0
  setStatus: setStatusEnum = setStatusEnum.playing
  roundWinner: number = 1
  sprite: Sprite | null = null
  activeBtn: boolean = true
  primary = this.$vuetify.theme.themes.dark.primary
  velPaddle: number = 4
  factor: number = 1

  get id() {
    return this.$route.params.id
  }

  onPressed(event: KeyboardEvent) {
    // console.log(event.key)
    switch (event.key) {
      case 'ArrowDown': {
        if (this.status === Status.playing) {
          this.down = true
          // console.log('down')
          // console.log('myside: ' + this.mySide)
          break
        }
      }
      case 'ArrowUp': {
        if (this.status === Status.playing) {
          this.up = true
          break
        }
      }
    }
  }

  restart() {
    console.log('restart')
    // this.x = false
    this.activeBtn = false
    this.$socket.client.emit('game_restart', {
      gameId: this.id,
      option: 0,
    })
  }

  restartWithOption() {
    console.log('restart')
    this.x = false
    this.activeBtn = false
    this.$socket.client.emit('game_restart', {
      gameId: this.id,
      option: 1,
    })
  }

  update_paddle() {
    // console.log('UPDATE')
    // console.log(this.down)
    let prevY: number = 0
    let Y: number = 0
    let nb: number = 0
    if (this.up) nb = this.velPaddle * -1 * this.factor
    else if (this.down) nb = this.velPaddle * this.factor
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
          // this.player2 = player2
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

      if (this.status !== Status.over) {
        if (this.sprite != null) {
          console.log('inside sprite')
          this.ctx.fillStyle = 'white'
          this.ctx.fillRect(
            this.sprite.x,
            this.sprite.y,
            this.sprite.width,
            this.sprite.height
          )
        }
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

        if (this.status === Status.waiting) {
          this.ctx.font = '80px Nunito'
          this.ctx.fillStyle = 'white'
          this.ctx.textAlign = 'center'
          this.ctx.fillText('' + this.timer, this.width / 2, this.height / 2)
        }
      } else {
        // console.log('status after over and before writing: ' + this.status)
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
  }

  get gameOver() {
    if (this.status != 3) return null
    if (this.setStatus === 1) return 'GAME OVER'
    else return this.winner?.username + 'wins !'
  }

  @Socket('game_state')
  getDatas(data: any) {
    const { paddle1, paddle2, ballX, ballY, state, sprite, factor } = data
    this.ballX = ballX
    this.ballY = ballY

    this.paddleLeftY = paddle1.y

    this.paddleRightY = paddle2.y
    this.timer = state
    this.sprite = sprite
    this.factor = factor
    console.log('FACTOR: ' + this.factor)
    // if (this.sprite != null)
    //   console.log('SPRITE X : ' + this.sprite.x)
    // else
    //   console.log('SPRITE NUL')
    if (this.timer === 3) this.status = Status.waiting
    this.activeBtn = true

    // console.log('timer: ' + this.timer)
    if (this.timer === -1 && this.status === Status.waiting) {
      this.status = Status.playing
      this.activeBtn = true
    }
    // console.log('game statae left: ' + this.paddleLeftY)
    // console.log('game state right: ' + this.paddleRightY)
  }

  @Socket('game_over')
  finishGame(data: any) {
    const { score1, score2 } = data
    // if (winner != null) {
    //   let winnerFt: User = winner
    //   this.message = winnerFt.username + ' wins!'
    // }
    var prev_score1 = this.score1
    this.score1 = score1
    this.score2 = score2
    if (this.score1 > prev_score1) this.roundWinner = 1
    else this.roundWinner = 2
    // this.setStatus = setStatus
    // console.log('OVERRRRR')
    // console.log('roundWinner = ' + this.roundWinner)
    // this.timer = -2
    this.status = Status.over
    // console.log('status after over: ' + this.status)
    // if (this.autoSaveInterval)
    //   clearInterval(this.autoSaveInterval)
  }

  @Socket('set_over')
  finishSet(data: any) {
    console.log('SET OVER')
    this.setStatus = setStatusEnum.over
    this.status = Status.over
    const { winner, score1, score2 } = data
    this.winner = winner
    if (this.winner !== null) this.message = this.winner.username + ' wins!'
    this.score1 = score1
    this.score2 = score2
  }
  //   @Socket('game_over')
  //  gameRestart() {

  //     if (winner != null) {
  //       let winnerFt: User = winner
  //       this.message = winnerFt.username + ' wins!'
  //     }
  //     this.score1 = score1
  //     this.score2 = score2
  //     this.setStatus = setStatus
  //     console.log('OVERRRRR')
  //     // this.timer = -2
  //     this.status = Status.over
  //     console.log('status after over: ' + this.status)
  //     // if (this.autoSaveInterval)
  //     //   clearInterval(this.autoSaveInterval)
  //   }
}
</script>
