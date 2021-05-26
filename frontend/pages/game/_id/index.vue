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

@Component
export default class Game extends Vue {
  canvas: HTMLCanvasElement | null = null
  ctx: CanvasRenderingContext2D | null = null

  private autoSaveInterval: NodeJS.Timeout | null = null
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

  get id() {
    return this.$route.params.id
  }

  onPressed(event: KeyboardEvent) {
    // console.log(event.key)
    switch (event.key) {
      case 'ArrowDown': {
        this.down = true
        break
      }
      case 'ArrowUp': {
        this.up = true
        break
      }
    }
  }

  update_paddle() {
    // console.log('UPDATE')
    // console.log(this.down)
    let prevY: number = 0
    let Y: number = 0
    let nb: number = 0
    if (this.up)
      nb = -2
    else if (this.down)
      nb = 2
    this.up = false
    this.down = false
    if (this.mySide == 1)
      {
        prevY = this.paddleLeftY
        this.paddleLeftY += nb
        Y = this.paddleLeftY
      }
      else if (this.mySide == 2)
      {
        prevY = this.paddleRightY
        this.paddleRightY += nb
        Y = this.paddleRightY
      }
    if (nb)
    {
      this.$socket.client.emit('game_move', {
        gameId: this.id,
        y: Y
        }, (err: any, body: any) => {
        if (err) {
          console.log('error')
          if (this.mySide == 1)
            this.paddleLeftY = prevY
          else
            this.paddleRightY = prevY
        }
        else
          console.log('ok')
        })
    }
    }

  mounted() {
    // console.log(this.height)
    this.canvas = <HTMLCanvasElement>document.getElementById('myCanvas')
    this.ctx = <CanvasRenderingContext2D>this.canvas.getContext('2d')
    let end = 0
    console.log('before game connect')
    // while(!end)
    // {
    this.$socket.client.emit('game_connect', {
      gameId: this.id},
      (err: any, body: any) => {
        if (!err) {

        }
        const { ok } = body
        if (ok)
          this.mySide = 2
        else
          this.mySide = 1
    })
    // }
    this.autoSaveInterval = setInterval(() => this.drawRect(), 1000 / 60)

    console.log('after game connect')
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
      console.log(this.paddleRightY)
      this.ctx.fillStyle = 'white'
      this.ctx.fillRect(this.paddleRightX, this.paddleRightY, 20, 100)
      this.ctx.fillStyle = 'white'
      this.ctx.fillRect(this.paddleLeftX, this.paddleLeftY, 20, 100)

      if (this.over)
      {
            this.ctx.font = "30px Nunito";
            this.ctx.fillStyle = "red";
            this.ctx.textAlign = "center";
            this.ctx.fillText("GAME OVER", this.width/2, this.height/2);
      }

      // update paddle

      // this.$socket.client.emit('game_move', {
      //   gameId: this.id,
      //   y: this.paddleLeftY
      //   }, (err: any, body: any) => {
      //   if (err) {
      //     this.paddleLeftY = prevY
      //   } else {

      //   }
      //   })
    }
  }
  @Socket('game_state')
  getDatas(data: any) {

    const { paddle1, paddle2, ballX, ballY } = data
    this.ballX= ballX
    this.ballY = ballY
    //  console.log('ballX: ' + this.ballX )
    //   console.log('ballY: ' + this.ballY )

    this.paddleLeftY = paddle1
   
    this.paddleRightY = paddle2
       console.log('left: ' + this.paddleLeftY )
       console.log('right: ' + this.paddleRightY )

  }
   @Socket('game_over')
   finishGame()
   {
    //  console.log('ovoer')
     this.over = true
   }
}
</script>
