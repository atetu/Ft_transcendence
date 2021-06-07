<template>
  <v-list-item>
    <v-list-item-content>
      <v-switch
        v-model="enabled"
        prepend-icon="mdi-two-factor-authentication"
        label="2-Factor Authentication"
      />
    </v-list-item-content>
    <v-list-item-icon v-if="enabled">
      <v-dialog v-model="dialog" width="500">
        <template #activator="{ on, attrs }">
          <v-btn color="primary" v-bind="attrs" v-on="on">
            <v-icon left>mdi-qrcode</v-icon>
            see qr-code
          </v-btn>
        </template>

        <v-card>
          <v-card-text class="text-center" style="padding: 24px !important">
            <qrcode
              :value="`Hello, World! #${value}`"
              :options="{ width: 400 }"
            />
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog = false"> Close </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-list-item-icon>
  </v-list-item>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'

@Component
export default class Dot extends Vue {
  enabled = true
  dialog = false

  value = 0
  interval: ReturnType<typeof setInterval> | null = null

  @Watch('enabled', { immediate: true })
  onEnabledUpdate(val: boolean) {
    if (val) {
      this.interval = setInterval(() => {
        this.value++
      }, 100)
    } else if (this.interval !== null) {
      clearTimeout(this.interval)
    }
  }

  destroyed() {
    if (this.interval !== null) {
      clearTimeout(this.interval)
    }
  }
}
</script>
