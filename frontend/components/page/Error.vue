<template>
  <v-main>
    <v-container fill-height fluid>
      <v-row align="center" justify="center">
        <v-col align="center" cols="12" sm="8" md="6">
          <v-alert color="error">
            <slot :error="error" :message="message">
              <h2>{{ message }}</h2>
            </slot>
          </v-alert>
          <slot name="button">
            <v-btn color="primary" @click="$emit('click')">
              {{ $t('error.retry') }}
            </v-btn>
          </slot>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class Loading extends Vue {
  @Prop()
  error!: Error

  get message(): string {
    return this.error?.message || 'error'
  }
}
</script>
