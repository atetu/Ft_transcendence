<template>
  <!-- Canvas -->

  <div style="text-align: center">
    <canvas
      id="myCanvas"
      :width="width"
      :height="height"
      tabindex="0"
      @keydown="onPressed"
    ></canvas>
    <span id="time">05:00</span>
  </div>

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
</style>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator' // propre a nuxt
import { Socket } from 'vue-socket.io-extended'

import { User } from '~/models'

@Component
export default class Game extends Vue {
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

  get id() {
    return this.$route.params.id
  }

  onPressed(event: KeyboardEvent) {
    // console.log(event.key)
    switch (event.key) {
      case 'ArrowDown': {
        if (this.playing)
        {
          this.down = true
          console.log('down')
          console.log('myside: ' + this.mySide)
          break
        }
      }
      case 'ArrowUp': {
        if (this.playing)
        {
          this.up = true
          break
        }
      }
    }
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
    console.log('front update: ' + Y)
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
            if (this.mySide == 1)
              this.paddleLeftY = prevY
            else
              this.paddleRightY = prevY
          }
          else
            console.log('ok')
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
          console.log('inside error')
          const { player1, player2 } = body
          if (player1.id === this.$store.state.auth.user.id)
            this.mySide = 1
          else 
            this.mySide = 2
        }
        console.log('MY SIDE: ' + this.mySide)
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

      if (this.over) {
        this.ctx.font = '80px Nunito'
        this.ctx.fillStyle = 'white'
        this.ctx.textAlign = 'center'
        this.ctx.fillText('GAME OVER', this.width / 2, this.height / 2)
      }
     
     if (this.timer != -1)
     {

      this.ctx.font = '80px Nunito'
      this.ctx.fillStyle = 'white'
      this.ctx.textAlign = 'center'
      this.ctx.fillText("" + this.timer, this.width / 2, this.height / 2)
 
     }
      if (this.timer === -1){
     this.playing = true
      }

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
   
    console.log('game statae left: ' + this.paddleLeftY)
    console.log('game state right: ' + this.paddleRightY)
   

  }

  @Socket('game_over')
  finishGame() {
    this.over = true
    // if (this.autoSaveInterval)
    //   clearInterval(this.autoSaveInterval)
  }

}
</script>
