<template>
 <v-container fill-height>
    <v-layout align-center justify-center>
      <v-flex>
        <v-card>
          <v-card-title class="headline">
            Welcome to Vue Dashboards!
          </v-card-title>
          <v-card-text>
            You can see latest weather conditions by going to the
            <span>
              <nuxt-link to="/dashboards">
                <v-text>Dashboard page</v-text>
              </nuxt-link>
            </span>
          </v-card-text>
          <!-- <p>
            {{ data }}
          </p> -->
        </v-card>
        <v-card>
          
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
