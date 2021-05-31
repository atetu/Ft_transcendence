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
    if (nb) {
      this.$socket.client.emit(
        'game_move',
        {
          gameId: this.id,
          y: Y,
        },
        (err: any, body: any) => {
          if (err) {
            console.log('error')
            if (this.mySide == 1) this.paddleLeftY = prevY
            else this.paddleRightY = prevY
          } else console.log('ok')
        }
      )
    }
  }

  // created(){
  //   console.log('CREATED')
  //   let display: Element | null  = null
  //   display = document.querySelector('#time')
  //   console.log('display ' + display)
  //   if (display != undefined)
  //     this.startTimer(display)
  // }

  mounted() {
    // console.log(this.height)
    this.canvas = <HTMLCanvasElement>document.getElementById('myCanvas')
    this.ctx = <CanvasRenderingContext2D>this.canvas.getContext('2d')
    // let end = 0
    // console.log('before game connect')
    // while(!end)
    // {

    // this.$socket.client.emit(
    //   'game_connect',
    //   {
    //     gameId: this.id,
    //   },
    //   (err: any, body: any) => {
    //     if (!err) {
    //     }
    //     const { ok } = body
    //     if (ok) this.mySide = 2
    //     else this.mySide = 1
    //   }
    // )
    
    this.autoSaveInterval = setInterval(() => this.drawRect(), 1000 / 60)
    // if (this.timer) {
    //     this.timerInterval = setInterval(() => this.startTimer(), 1000)
    //   }
    
    // console.log('after game connect')
  }

  // startTimer() {
  //   this.message = '' + this.timer
  //   console.log(this.message)
  //   this.timer--
  //   if (this.timer <= 0)
  //   {
      
  //   }
  // }

  drawRect(): void {
    if (this.ctx != null) {
      // if (this.timer == -2)
      // {
      //   this.$socket.client.emit(
      //   'game_connect',
      //   {
      //     gameId: this.id,
      //   },
      //   (err: any, body: any) => {
      //     if (!err) {
      //     }
      //     const { ok } = body
      //     if (ok) this.mySide = 2
      //     else this.mySide = 1
      //   }
      // )
      //   // this.timer--
      // }
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
      console.log(this.paddleRightY)
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
    //  console.log(this.message)
      // console.log('should write)')
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

  // @Socket('gameConnect')
  // setUser(data: any)
  // {
  //   const { player1, player2 } = data
  //   console.log('player1: ' + player1)
  //   console.log('player2: ' + player2)
  //   console.log('user.id: ' + this.user.id)
  //   this.fetch()
  //   if (this.user && player1 === this.user.id)
  //     this.mySide = 1
  //   else if (this.user && player1 === this.user.id)
  //     this.mySide = 2
  //   console.log('MY SIDE: ' + this.mySide)
  // }

  @Socket('game_state')
  getDatas(data: any) {
    const { player1, player2, paddle1, paddle2, ballX, ballY, state } = data
   
    this.ballX = ballX
    this.ballY = ballY
    //  console.log('ballX: ' + this.ballX )
    //   console.log('ballY: ' + this.ballY )

    this.paddleLeftY = paddle1.y

    this.paddleRightY = paddle2.y
    this.timer = state
    console.log('userrr: ' + this.$socket.client.id)
        console.log('player1: ' + player1.id)
        console.log('player2: ' + player2.id)

    if (player1.id ===this.$socket.data)
        this.mySide = 1
    else 
      this.mySide = 2
    // else if (this.user && player1 === this.user.id)
    //   this.mySide = 1
    
    // console.log('left: ' + this.paddleLeftY)
    // console.log('right: ' + this.paddleRightY)
    // console.log('timer: ' + this.timer)

  }

  @Socket('game_over')
  finishGame() {
    //  console.log('ovoer')
    this.over = true
    // if (this.autoSaveInterval)
    //   clearInterval(this.autoSaveInterval)
  }

}
</script>
