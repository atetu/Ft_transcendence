<template>
  <v-progress-circular value="100" width="1" :color="color">
    <v-avatar size="30">
      <v-img max-height="40" max-width="40" :src="picture"></v-img>
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

  get picture() {
    return `https://i.pravatar.cc/150?img=${this.user.id}`
  }

  get online(): boolean {
    return this.$store.state.socket.connectedUserIds.includes(this.user.id)
  }

  get color(): string {
    return this.online ? 'green' : 'red'
  }
}
</script>
