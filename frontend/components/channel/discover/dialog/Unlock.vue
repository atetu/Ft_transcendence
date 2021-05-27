<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-card-title>
        {{ $t('channel.discover.unlock.title', { name: channel.name }) }}
        <v-spacer />
        <button-close @click="dialog = false" />
      </v-card-title>
      <v-card-text>
        <v-text-field
          clearable
          cache-items
          class="mx-4 mt-2"
          flat
          hide-no-data
          :label="$t('channel.discover.unlock.label')"
          solo-inverted
          item-text="username"
          item-value="id"
          type="password"
          autocomplete="new-password"
        >
          <template #append-outer>
            <v-btn large color="primary" height="48" class="ml-2">
              unlock
            </v-btn>
          </template>
        </v-text-field>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { Channel } from '~/models'

@Component
export default class ComponentImpl extends Vue {
  @Prop({ type: Object })
  channel!: Channel

  dialog = false

  open() {
    this.dialog = true
  }
}
</script>
