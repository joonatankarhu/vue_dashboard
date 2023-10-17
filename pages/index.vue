<template>
 <v-container fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md6>
        <v-card>
        <v-card-title class="headline">
          Welcome to Vue Dashboards!
        </v-card-title>
        <v-card-text>Lorem ipsum dolor sit amet, consectetur adipisicing.</v-card-text>
        <v-text color="primary" align="center">
          {{ data }}
        </v-text>
      </v-card>
      </v-flex>
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
