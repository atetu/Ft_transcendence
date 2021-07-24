<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template #activator="{ on, attrs }">
      <v-btn v-if="small" icon color="primary" v-bind="attrs" v-on="on">
        <v-icon>mdi-sword-cross</v-icon>
      </v-btn>
      <v-btn
        v-else
        color="primary"
        v-bind="attrs"
        v-on="on"
        @click="dialog = true"
      >
        challenge
        <v-icon right>mdi-sword-cross</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Game options</span>
      </v-card-title>
      <v-card-text>
        {{ inputs }}
        <v-container>
          <v-row>
            <v-col cols="12" sm="6">
              <v-select
                v-model="inputs.maps"
                :items="['1', '2', '3', '4']"
                label="Maps"
                required
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                v-model="inputs.nbGames"
                :items="['1', '2', '3', '4']"
                label="Number of games per set"
                required
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                v-model="inputs.ballVelocity"
                :items="[
                  {
                    text: 'Slow',
                    value: 0.8,
                  },
                  {
                    text: 'Normal',
                    value: 1,
                  },
                  {
                    text: 'Fast',
                    value: 1.2,
                  },
                  {
                    text: 'Very fast',
                    value: 1.5,
                  },
                ]"
                label="Ball speed"
                required
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                v-model="inputs.paddleVelocity"
                :items="[
                  {
                    text: 'Slow',
                    value: 0.8,
                  },
                  {
                    text: 'Normal',
                    value: 1,
                  },
                  {
                    text: 'Fast',
                    value: 1.2,
                  },
                  {
                    text: 'Very fast',
                    value: 1.5,
                  },
                ]"
                label="Paddle speed"
                required
              ></v-select>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="submit">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { User } from '~/models'

@Component
export default class Viewer extends Vue {
  @Prop({ type: Object, required: true })
  peer!: User

  @Prop({ type: Boolean })
  block!: boolean

  @Prop({ type: Boolean })
  neverSmall!: boolean

  loading = false
  dialog = false
  paddleVelocity: number = 1
  ballVelocity: number = 1
  map: number = 0
  nbGames: number = 3

  inputs = {
    paddleVelocity: 1,
    maps: 0,
    ballVelocity: 1,
    nbGames: 3,
  }

  get small() {
    if (this.neverSmall) {
      return false
    }

    return this.$vuetify.breakpoint.name === 'xs'
  }

  // paddleClick(data: any) {
  //   let paddleArray = ['Slow', 'Normal', 'Fast', 'Very fast']
  //   this.paddleVelocity = paddleArray.findIndex(
  //     (paddleArray) => paddleArray === data
  //   )
  // }

  // mapsClick(data: any) {
  //   let mapsArray = ['1', '2', '3', '4']
  //   this.map = mapsArray.findIndex((mapsArray) => mapsArray === data)
  // }

  // ballClick(data: any) {
  //   let ballArray = ['Slow', 'Normal', 'Fast', 'Very fast']
  //   this.ballVelocity = ballArray.findIndex((ballArray) => ballArray === data)
  // }

  async submit() {
    this.dialog = false
    if (this.loading) {
      return
    }
    console.log('INPU MAP: ' + this.inputs.maps)
    this.loading = true
    //  console.log(this.inputs.map)
    //     console.log(this.inputs.ballVelocity)
    //     console.log(this.inputs.paddleVelocity)
    try {
      await this.$axios.post(`pending-games`, {
        peerId: this.peer.id,
        map: this.inputs.maps,
        ballVelocity: this.inputs.ballVelocity,
        paddleVelocity: this.inputs.paddleVelocity,
        nbGames: this.inputs.nbGames,
      })

      this.$emit('success')
    } catch (error) {
      this.$dialog.notify.error(`Could not challenge: ${error}`)
    }

    this.loading = false
  }
}
</script>
