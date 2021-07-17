<template>
  <page-loading v-if="$fetchState.pending" />
  <page-error
    v-else-if="$fetchState.error"
    :error="$fetchState.error"
    @click="$fetch()"
  />
  <div v-else class="fill-height" style="overflow: auto">
    <v-tabs v-model="tab" fixed-tabs>
      <v-tab v-for="item in items" :key="item">
        <v-icon left>mdi-{{ item.icon }}</v-icon>
        {{ item.title }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-card flat>
          <v-card-title>online - {{ onlines.length }}</v-card-title>
          <v-list>
            <v-list-item
              v-for="{ peer: user } in onlines"
              :key="user.id"
              link
              :to="`/users/${user.id}`"
            >
              <v-list-item-avatar size="60">
                <user-avatar :user="user" />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  {{ user.username }}
                  <v-icon v-if="user.admin" right>
                    mdi-account-supervisor
                  </v-icon>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-title>all friends - {{ friends.length }}</v-card-title>
          <v-list>
            <v-list-item
              v-for="{ peer: user } in friends"
              :key="user.id"
              link
              :to="`/users/${user.id}`"
            >
              <v-list-item-avatar size="60">
                <user-avatar :user="user" />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  {{ user.username }}
                  <v-icon v-if="user.admin" right>
                    mdi-account-supervisor
                  </v-icon>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-title>pending - {{ pending.length }}</v-card-title>
          <v-list>
            <v-list-item
              v-for="{ peer: user } in pending"
              :key="user.id"
              link
              :to="`/users/${user.id}`"
            >
              <v-list-item-avatar size="60">
                <user-avatar :user="user" />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  {{ user.username }}
                  <v-icon v-if="user.admin" right>
                    mdi-account-supervisor
                  </v-icon>
                </v-list-item-title> </v-list-item-content
              ><v-list-item-icon>
                <v-icon>mdi-check-bold</v-icon>
              </v-list-item-icon>
              <v-list-item-icon>
                <v-icon>mdi-close-thick</v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-title>blocked - {{ blocked.length }}</v-card-title>
          <v-list>
            <v-list-item
              v-for="{ peer: user } in blocked"
              :key="user.id"
              link
              :to="`/users/${user.id}`"
            >
              <v-list-item-avatar size="60">
                <user-avatar :user="user" />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  {{ user.username }}
                  <v-icon v-if="user.admin" right>
                    mdi-account-supervisor
                  </v-icon>
                </v-list-item-title>
              </v-list-item-content>
              <v-list-item-icon>
                <v-icon>mdi-account-remove</v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { Relationship, RelationshipType } from '~/models'
import { relationshipsStore, socketStore } from '~/store'
import API from '~/api/API'

@Component
export default class Page extends Vue {
  tab = null
  items = [
    {
      title: 'online',
      icon: 'access-point',
    },
    {
      title: 'friends',
      icon: 'human-greeting',
    },
    {
      title: 'pending',
      icon: 'motion-pause',
    },
    {
      title: 'blocked',
      icon: 'block-helper',
    },
  ]
  text =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'

  head() {
    return {
      title: 'Relationships',
    }
  }

  get friends() {
    return relationshipsStore.list.filter(
      (x) => x.type === RelationshipType.FRIEND
    )
  }

  get onlines() {
    const { connectedUserIds } = socketStore

    return this.friends.filter((x) => connectedUserIds.includes(x.peer.id))
  }

  get pending() {
    return relationshipsStore.list.filter(
      (x) =>
        x.type === RelationshipType.INCOMING ||
        x.type === RelationshipType.OUTCOMING
    )
  }

  get blocked() {
    return relationshipsStore.list.filter(
      (x) => x.type === RelationshipType.BLOCK
    )
  }

  async fetch() {
    await relationshipsStore.fetchAll()
  }

  get relationships(): Array<Relationship> {
    return relationshipsStore.list
  }
}
</script>
