<template>
  <div class="d-block text-center mx-auto mt-4">
    <v-tooltip right>
      <template #activator="{ on, attr }">
        <v-btn icon large nuxt to="/profile" v-bind="attr" v-on="on">
          <v-avatar color="grey darken-1" size="36">
            <v-icon small>mdi-account-question</v-icon>
          </v-avatar>
        </v-btn>
      </template>

      <span>profile</span>
    </v-tooltip>
  </div>
</template>
