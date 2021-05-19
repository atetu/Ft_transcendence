<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    {{ error }}

    <v-text-field
      v-model="name"
      :counter="20"
      :rules="rules.name"
      :label="$t('channel.field.name._')"
      required
    ></v-text-field>

    <v-select
      v-model="visibility"
      :items="visibilities"
      :rules="rules.visibility"
      :label="$t('channel.field.visibility._')"
      required
    ></v-select>

    <v-text-field
      v-model="password"
      :rules="rules.password"
      :label="$t('channel.field.password._')"
      required
    ></v-text-field>

    <v-btn
      :disabled="!valid"
      :loading="loading"
      color="primary"
      class="mr-4"
      @click="update"
    >
      {{ editMode ? 'edit' : 'create' }}
    </v-btn>
  </v-form>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

import { Channel, ChannelVisibility } from '~/models'

@Component
export default class Edit extends Vue {
  @Prop({ type: Object })
  initial!: Channel

  loading = false
  error: any = null

  name = ''
  visibility = ChannelVisibility.PUBLIC
  password = ''
  valid = true

  rules = {
    name: [
      (v: string) => !!v || 'Name is required',
      (v: string) =>
        (v && v.length >= 3 && v.length <= 20) ||
        'Name must be between 3 and 20 characters',
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

  get editMode() {
    return !!this.initial?.id
  }

  get actionUrl() {
    const id = this.initial?.id

    if (id) {
      return `/channels/${id}`
    }

    return `/channels`
  }

  update() {
    this.form.validate()

    if (!this.valid) {
      return
    }

    if (this.loading) {
      return
    }

    return this.$axios
      .post(this.actionUrl, {
        name: this.name,
        visibility: this.visibility,
        password: this.password,
      })
      .then((response) => {
        const channel: Channel = response.data

        this.$router.push(`/channels/${channel.id}`)
      })
      .catch((error) => {
        this.error = error
      })
      .then(() => {
        this.loading = false
      })
  }

  created() {
    if (this.initial) {
      this.name = this.initial.name
      this.visibility = this.initial.visibility
    }
  }
}
</script>
