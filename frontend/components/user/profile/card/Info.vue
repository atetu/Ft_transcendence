<template>
  <v-card class="pa-2" outlined>
    <v-row justify="center" align="center">
      <user-avatar
        :user="user"
        :size="128"
        :without-state="isMe"
        class="mt-8 mb-6"
      />
    </v-row>
    <v-card-title class="headline">
      <v-spacer />
      {{ user.username }}
      <v-spacer />
    </v-card-title>
    <v-card-subtitle class="text-center">
      joined <br />
      15 05 2021
    </v-card-subtitle>
    <v-col cols="12">
      <v-row justify="center" align="center">
        <v-col v-if="isMe" cols="12">
          <v-btn block color="primary" to="/profile/settings">
            settings
            <v-icon right>mdi-cog</v-icon>
          </v-btn>
        </v-col>
        <template v-else>
          <v-col cols="12">
            <v-btn depressed block color="primary">
              ask game
              <v-icon right>mdi-sword-cross</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="12" xl="6">
            <v-btn depressed block color="primary" @click="askFriend">
              friend
              <v-icon right>mdi-account-plus</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="12" xl="6">
            <v-btn depressed block color="primary" @click="askBlock">
              block
              <v-icon right>mdi-cancel</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="12">
            <v-btn outlined block color="primary" :to="toMessage">
              message
              <v-icon right>mdi-message-arrow-right</v-icon>
            </v-btn>
          </v-col>
          <v-col v-if="selfIsSiteAdmin && !isAdmin" cols="12">
            <user-button-ban :user="user" @refresh="refresh" />
          </v-col>
        </template>
      </v-row>
    </v-col>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { User } from '~/models'
import { authStore } from '~/store'

@Component
export default class Dot extends Vue {
  @Prop()
  user!: User

  get isMe() {
    return authStore.user!.id === this.user.id
  }

  get isAdmin() {
    return this.user.admin
  }

  get selfIsSiteAdmin() {
    return authStore.user!.admin
  }

  get picture() {
    return `/api/users/${this.user.id}/avatar`
  }

  get toMessage() {
    return `/direct-messages/${this.user.id}`
  }

  refresh() {
    this.$emit('refresh')
  }

  askFriend() {
    this.$dialog.warning({
      title: 'Friendship confirmation',
      text: 'Are you sure',
      actions: [
        {
          key: 'yes',
          text: 'Yes',
          color: 'error',
          handler: async () => {
            try {
              await this.$axios.$post(`/users/@me/relationships`, {
                peerId: this.user.id,
                type: 'friend',
              })

              this.$dialog.notify.success('friendship request send')

              this.$emit('refresh')
            } catch (error) {
              this.$dialog.notify.error('could not send friendship request')
            }
          },
        },
        {
          key: 'cancel',
          text: 'Cancel',
        },
      ],
    })
  }
  askBlock() {
    this.$dialog.warning({
      title: 'Blocking confirmation',
      text: 'Are you sure',
      actions: [
        {
          key: 'yes',
          text: 'Yes',
          color: 'error',
          handler: async () => {
            try {
              await this.$axios.$post(`/users/@me/relationships`, {
                peerId: this.user.id,
                type: 'block',
              })

              this.$dialog.notify.success('user blocked')

              this.$emit('refresh')
            } catch (error) {
              this.$dialog.notify.error('could not block user')
            }
          },
        },
        {
          key: 'cancel',
          text: 'Cancel',
        },
      ],
    })
  }
}
</script>
