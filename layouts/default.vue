<template>
  <v-app>
    <header>
      <v-app-bar
        elevation="4"
        rounded
        shaped
        app
      >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    </v-app-bar>
    </header>

    <v-navigation-drawer
      v-model="drawer"
      app
      left
      temporary
    >
      <v-list
        nav
        dense
      >
        <v-list-item-group
          active-class="text--accent-4"
        >
        <v-list>
          <nuxt-link class="link" to="/">
            <v-list-item>
              <v-list-item-title>Homepage</v-list-item-title>
            </v-list-item>
          </nuxt-link>

          <nuxt-link class="link" to="/dashboards">
            <v-list-item>
              <v-list-item-title>Dashboards</v-list-item-title>
            </v-list-item>
          </nuxt-link>

          <nuxt-link class="link" to="/settings">
            <v-list-item>
              <v-list-item-title>Settings</v-list-item-title>
            </v-list-item>
          </nuxt-link>
        </v-list>

        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container class="d-flex flex-row align-center">
        <nuxt />
      </v-container>
    </v-main>

   
    <v-footer
    app
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

<style scoped>
.link {
  text-decoration: none; /* Remove the underline */
  color: inherit; /* Inherit the parent text color */
}
</style>