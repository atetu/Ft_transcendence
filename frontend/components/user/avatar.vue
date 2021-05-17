<template>
  <v-progress-circular value="100" width="1" :color="color">
    <v-avatar>
      <v-icon>mdi-sword</v-icon>
    </v-avatar>
  </v-progress-circular>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { User } from '~/models'

@Component
export default class Loading extends Vue {
  @Prop({ type: Object })
  user!: User

  get online(): boolean {
    return this.$store.state.socket.connectedUserIds.includes(this.user.id)
  }

  get color(): string {
    return this.online ? 'green' : 'red'
  }
}
</script>
