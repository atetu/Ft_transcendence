<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template #activator="{ on, attrs }">
      <slot name="activator" :bind="attrs" :on="on" />
    </template>
    <v-card>
      <v-card-title>
        {{ $t('channel.leave.title', { name: channel.name }) }}
        <v-spacer />
        <button-close @click="dialog = false" />
      </v-card-title>
      <v-card-text>
        <v-alert v-if="errorMessage" type="error"> {{ errorMessage }} </v-alert>
        <v-btn
          large
          block
          color="primary"
          height="48"
          :loading="loading"
          @click="submit()"
        >
          leave
        </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import API from '~/api/API'
import { Channel, User } from '~/models'
import { authStore } from '~/store'

@Component
export default class ComponentImpl extends Vue {
  @Prop({ type: Object })
  channel!: Channel

  dialog = false
  loading = false
  error: any = null

  get errorMessage() {
    if (this.error) {
      return (
        this.error?.response?.data?.errors?.message ||
        'could not leave the channel'
      )
    }

    return null
  }

  async submit() {
    if (this.loading) {
      return
    }

    this.loading = true
    this.error = null

    try {
      const user: User = authStore.user!
      await API.ChannelUsers.destroy(this.channel, user)

      this.$emit('leaved')
    } catch (error) {
      this.error = error
    }

    this.loading = false
  }
}
</script>
