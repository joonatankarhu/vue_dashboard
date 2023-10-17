<template>
  <v-app>
    <header>
      <v-app-bar
        elevation="4"
        rounded
        shaped
        app
      >
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
        <v-toolbar-title>Page title</v-toolbar-title>
    </v-app-bar>
    </header>

    <v-main>
      <v-container class="d-flex flex-row align-center">
        <nuxt />
      </v-container>
    </v-main>

   
    <v-footer
    app
      :padless="padless"
      class="align-end"
    >
      <v-card
        flat
        tile
        width="100%"
        class="lighten-1 text-center"
      >

        <v-card-text>
          {{ new Date().getFullYear() }} © <strong>Vue Dashboards</strong>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js'
    }
  },
  computed: {
    testData() {
      return this.$store.state.data
    }
  }
}
</script>

<style>
</style>