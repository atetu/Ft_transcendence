<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template #activator="{ on, attrs }">
      <slot name="activator" :bind="attrs" :on="on" />
    </template>
    <v-card>
      <v-card-title>
        {{ $t('channel.invite.title', { name: channel.name }) }}
        <v-spacer />
        <button-close @click="dialog = false" />
      </v-card-title>
      <v-card-text>
        <v-autocomplete
          v-model="select"
          :loading="queryLoading"
          :disabled="loading"
          :items="items"
          :search-input.sync="search"
          clearable
          cache-items
          class="mx-4 mt-2"
          :error-messages="errors"
          flat
          hide-no-data
          :label="$t('channel.invite.label')"
          solo-inverted
          item-text="username"
          item-value="id"
        >
          <template #append-outer>
            <v-btn
              :loading="queryLoading || loading"
              :disabled="!isSelected"
              large
              color="primary"
              height="48"
              class="ml-2"
              @click="submit()"
            >
              invite
            </v-btn>
          </template>
        </v-autocomplete>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator'
import { Channel } from '~/models'

@Component
export default class ComponentImpl extends Vue {
  @Prop({ type: Object })
  channel!: Channel

  dialog = false

  queryLoading = false
  loading = false
  error: any = null

  items = []
  search = null
  select = null

  @Watch('search')
  onSearchUpdate(val: string) {
    this.error = null

    val && val !== this.select && this.querySelections(val)
  }

  get errors() {
    if (this.error) {
      return [
        this.error?.response?.data?.errors?.message ||
          'could not add this person',
      ]
    }

    return null
  }

  get isSelected() {
    return !!this.select
  }

  querySelections(query: string) {
    this.queryLoading = true
    this.error = null

    this.$axios
      .$get('/search/users', {
        params: {
          query,
        },
      })
      .then((response) => {
        this.items = response
      })
      .catch((error) => {
        console.log(error)
      })
      .then(() => (this.queryLoading = false))
  }

  async submit() {
    if (this.isSelected) {
      this.loading = true
      this.error = null

      try {
        await this.$axios.post(`/channels/${this.channel.id}/users`, {
          userId: this.select,
        })

        this.$emit('invited')
      } catch (error) {
        this.error = error
      }

      this.loading = false
    }
  }
}
</script>
