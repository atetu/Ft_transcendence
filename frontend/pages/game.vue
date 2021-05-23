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

@Component
export default class Game extends Vue {
  canvas: HTMLCanvasElement | null = null
  ctx: CanvasRenderingContext2D | null = null

  private autoSaveInterval: NodeJS.Timeout | null = null
  ball_x: number = 300
  ball_y = 200
  height: number = 600
  width: number = 800
  up: boolean = false
  down: boolean = false
  paddle_right_x = 15
  paddle_right_y = 10
  paddle_left_x = 770
  paddle_left_y = 10

  onPressed(event: KeyboardEvent) {
    console.log(event.key)
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
      console.log("UPDATE")
      console.log(this.down)
    if (this.up) {
      this.paddle_right_y-= 1
      this.up = false
    //   input = { side: self.my_side, movement: 'up' }
    //   self.sub.perform('input', input)
    }
    if (this.down) {
      console.log('GO Down')
      this.paddle_right_y+= 1
      this.down = false
    //   input = { side: self.my_side, movement: 'down' }
    //   self.sub.perform('input', input)
    }
  }

  mounted() {
    console.log(this.height)
    this.canvas = <HTMLCanvasElement>document.getElementById('myCanvas')
    this.ctx = <CanvasRenderingContext2D>this.canvas.getContext('2d')
    this.autoSaveInterval = setInterval(() => this.drawRect(), 1000 / 60)
  }

  drawRect(): void {
    if (this.ctx != null) {
      this.ctx.clearRect(0, 0, this.width, this.height)
      this.ctx.fillStyle = `${this.$vuetify.theme.themes.dark.primary}`
      this.ctx.fillRect(0, 0, this.width, this.height)

      this.ctx.beginPath()
      this.ctx.arc(this.ball_x, this.ball_y, 15, 0, Math.PI * 2)
      this.ctx.fillStyle = 'white'
      this.ctx.fill()
      this.ctx.closePath()

      this.ctx.strokeStyle = 'grey'
      this.ctx.moveTo(400, 20)
      this.ctx.lineTo(400, 580)
      this.ctx.stroke()
      
      this.update_paddle()
      console.log(this.paddle_right_y)
      this.ctx.fillStyle = 'white'
      this.ctx.fillRect(this.paddle_right_x, this.paddle_right_y, 20, 100);
      this.ctx.fillStyle = 'white'
      this.ctx.fillRect(this.paddle_left_x, this.paddle_left_y, 20, 100);

    }
  }
}
</script>
