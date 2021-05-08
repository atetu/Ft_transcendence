<template>
  <div>
    <v-app-bar app clipped-right class="mini-drawer-offset"> qsdqsd </v-app-bar>
    <h1>
      qsd qsd qsd qsd qsd qsd qsd qsd qsd qsd qsd qsd qsd qsd qsd qsd qsd qsd
      qsd qsd qsd qsd qsd qsd qsd qsd qsd
    </h1>
    <drawer-right>
      <v-list>
        <v-list-item v-for="n in 50" :key="n" link>
          <v-list-item-content>
            <v-list-item-title>Item {{ n }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template #append>
        <v-list>
          <v-list-item>
            <v-btn block color="primary">
              settings
              <v-icon right>mdi-cog</v-icon>
            </v-btn>
          </v-list-item>

          <v-list-item>
            <v-btn block color="primary">
              invite
              <v-icon right>mdi-account-plus</v-icon>
            </v-btn>
          </v-list-item>
        </v-list>
      </template>
    </drawer-right>
  </div>
</template>
