<template>
  <v-card link :to="to" @click="click()">
    <v-card-title>
      {{ channel.name }}
      <template v-if="isProtected">
        <v-spacer />
        <v-tooltip left>
          <template #activator="{ attrs, on }">
            <v-icon color="primary" v-bind="attrs" v-on="on"> mdi-lock </v-icon>
          </template>
          <span>require a password</span>
        </v-tooltip>
        <channel-discover-dialog-unlock ref="unlock" :channel="channel" />
      </template>
    </v-card-title>
    <v-card-subtitle>{{ channel.owner.username }}</v-card-subtitle>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { Channel, ChannelVisibility } from '~/models'

@Component
export default class CompomentImpl extends Vue {
  @Prop()
  channel!: Channel

  get isProtected() {
    return this.channel.visibility === ChannelVisibility.PROTECTED
  }

  get to() {
    if (this.isProtected) {
      return null
    }

    return `/channels/${this.channel.id}`
  }

  click() {
    if (this.isProtected) {
      ;(this.$refs.unlock as any).open()
    }
  }
}
</script>
