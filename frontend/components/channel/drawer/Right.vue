<template>
  <drawer-right>
    <channel-user-list :channel="channel" :users="users" />
    <template v-if="hasJoined" #append>
      <v-list>
        <v-list-item>
          <channel-dialog-settings :channel="channel" :users="users">
            <template #activator="{ on, attrs }">
              <v-btn block color="primary" v-bind="attrs" v-on="on">
                {{ $t('channel.settings.button') }}
                <v-icon right>mdi-cog</v-icon>
              </v-btn>
            </template>
          </channel-dialog-settings>
        </v-list-item>

        <v-list-item>
          <channel-dialog-invite :channel="channel">
            <template #activator="{ on, attrs }">
              <v-btn block color="primary" v-bind="attrs" v-on="on">
                {{ $t('channel.invite.button') }}
                <v-icon right>mdi-account-plus</v-icon>
              </v-btn>
            </template>
          </channel-dialog-invite>
        </v-list-item>

        <v-list-item>
          <channel-dialog-leave :channel="channel">
            <template #activator="{ on, attrs }">
              <v-btn block color="primary" v-bind="attrs" v-on="on">
                {{ $t('channel.leave.button') }}
                <v-icon right>mdi-logout-variant</v-icon>
              </v-btn>
            </template>
          </channel-dialog-leave>
        </v-list-item>
      </v-list>
    </template>
  </drawer-right>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

import { Channel, ChannelUser } from '~/models'

@Component
export default class Index extends Vue {
  @Prop({ type: Object })
  channel!: Channel

  @Prop({ type: Array })
  users!: ChannelUser[]

  @Prop({ type: Boolean })
  hasJoined!: boolean

  public get toSettings() {
    const id = this.channel?.id

    if (id === undefined) {
      return null
    }

    return `/channels/${id}/settings`
  }
}
</script>
