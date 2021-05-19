<template>
  <div class="pa-4 fill-height" style="overflow-y: scroll">
    <v-app-bar app clipped-right>
      <v-toolbar-title> channel.name </v-toolbar-title>
    </v-app-bar>

    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            Channel
            <v-spacer />
            <v-btn icon>
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <channel-settings-edit />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12">
        <channel-settings-users :channel="channel" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data: () => ({
    channel: {
      id: 1,
      owner: {
        id: 1,
      },
    },
    users: [
      {
        id: 1,
        username: 'Enzo',
        admin: true,
        muted: false,
        banned: false,
      },
      {
        id: 2,
        username: 'Badria',
        admin: true,
        muted: false,
        banned: false,
      },
      {
        id: 99,
        username: 'Alice',
        admin: true,
        muted: true,
        banned: false,
      },
      {
        id: 3,
        username: 'Jean',
        admin: false,
        muted: false,
        banned: false,
      },
      {
        id: 4,
        username: 'Luc',
        admin: false,
        muted: false,
        banned: false,
      },
      {
        id: 5,
        username: 'Pierre',
        admin: false,
        muted: false,
        banned: true,
      },
    ],
  }),
}
</script>
