<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-text-field
      v-model="name"
      :counter="10"
      :rules="rules.name"
      label="Name"
      required
    ></v-text-field>

    <v-select
      v-model="visibility"
      :items="visibilities"
      :rules="rules.visibility"
      label="Visibility"
      required
    ></v-select>

    <v-text-field
      v-model="password"
      :rules="rules.password"
      label="Password"
      required
    ></v-text-field>

    <v-btn :disabled="!valid" color="success" class="mr-4"> Validate </v-btn>
  </v-form>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import { ChannelVisibility } from '~/models'

@Component
export default class Edit extends Vue {
  name = ''
  visibility = ChannelVisibility.PUBLIC
  password = ''
  valid = true

  rules = {
    name: [
      (v: string) => !!v || 'Name is required',
      (v: string) =>
        (v && v.length <= 10) || 'Name must be less than 10 characters',
    ],
    visibility: [(v: ChannelVisibility) => !!v || 'Visibility is required'],
    password: [],
  }

  validate() {
    this.form.validate()
  }

  get visibilities() {
    return this.visibilityEnumValues.map((visibility) => ({
      text: this.$t(`channel.visibility.${visibility}`),
      value: visibility,
    }))
  }

  get visibilityEnumValues() {
    return [
      ChannelVisibility.PUBLIC,
      ChannelVisibility.PROTECTED,
      ChannelVisibility.PRIVATE,
    ]
  }

  get form(): any {
    return this.$refs.form
  }
}
</script>
