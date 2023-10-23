<template>
 <v-container fill-height>
    <v-layout align-center justify-center>
      <v-card style="max-width: 750px;">
        <v-card-title class="headline">
          Weather Dashboards!
        </v-card-title>
        <v-card-text>
          You can see the latest weather conditions by visiting the
          <span>
            <nuxt-link to="/dashboards">
                Dashboard
            </nuxt-link>
          </span>
        </v-card-text>
      </v-card>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'IndexPage',
  data() {
    return {
      data: this.$store.state.data
    }
  }
}
</script>

<style scoped>

a {
  text-decoration: none;
}

</style>