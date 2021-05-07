<template>
  <div class="d-block text-center mx-auto mb-3">
    <v-tooltip right>
      <template #activator="{ on, attr }">
        <v-btn icon large nuxt :to="url" v-bind="attr" v-on="on">
          <v-icon> mdi-{{ icon }} </v-icon>
        </v-btn>
      </template>

      <span>{{ title }}</span>
    </v-tooltip>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    icon: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
})
</script>
