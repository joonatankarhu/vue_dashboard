<template>
  <v-container fill-height>
    <v-layout class="d-flex column col-12" align-center justify-center>
        <v-card-title class="headline text-h3 mb-5">
          Dashboard
        </v-card-title>
        <v-container>
          <v-row>
            <v-col
              v-for="(chart, index) in charts"
              :key="'chart' + index"
              :cols="smallScreen ? 12 : 6"
              class="d-flex"
            >
              <Chart
                :chartId="chart.id"
                :title="chart.title"
                :minDate="todaysDate"
                :maxDate="maxDate"
                :dates="apiData.hourly.time"
                :datapoints="chart.datapoints"
                :chartType="chart.chartType"
                :chartLabel="chart.chartLabel"
                :backgroundColor="chart.backgroundColor"
                :borderColor="chart.borderColor"
              />
            </v-col>
          </v-row>
        </v-container>
    </v-layout>
  </v-container>
</template>
 
<script>
import Chart from '../components/Chart.vue'
import axios from 'axios';

export default {
  name: 'Dashboards',
  components: {
    Chart
  },
  data() {
    return {
      loading: true,
      apiData: null,
      charts: []
      // dataFetched: false,
    }
  },
  computed: {
    todaysDate() {
      const today = new Date();

      // Get year, month, and day part from the date
      const year = today.toLocaleString("default", { year: "numeric" });
      const month = today.toLocaleString("default", { month: "2-digit" });
      const day = today.toLocaleString("default", { day: "2-digit" });

      // Generate yyyy-mm-dd date string
      const formattedDate = year + "-" + month + "-" + day;

      return formattedDate
    },
    maxDate() {
      const today = new Date();

      const year = today.toLocaleString("default", { year: "numeric" });
      const month = today.toLocaleString("default", { month: "2-digit" });
      const day = today.toLocaleString("default", { day: "2-digit" });

      // Generate yyyy-mm-dd date string
      return year + "-" + month + "-" + day.slice(0, -1) + 1;
      
    },
    smallScreen() {
      return this.$vuetify.breakpoint.smAndUp == false
    }
  },
  methods: {
    fetchData() {
      try {
        axios.get('https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,windspeed_10m&hourly=temperature_2m,relativehumidity_2m,windspeed_10m')
          .then((res) => {
            this.apiData = res.data
            this.createCharts()
            this.loading = false
          })
      } catch (err) {
        console.log(err);
      }
    },
    createCharts() {
      this.charts = [
        {
          id: 'temperature',
          title: 'Temperatures',
          datapoints: this.apiData.hourly.temperature_2m,
          chartType: 'bar',
          chartLabel: 'Temperature °C',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgb(54, 162, 235)',
        },
        {
          id: 'humidity',
          title: 'Humidity',
          datapoints: this.apiData.hourly.relativehumidity_2m,
          chartType: 'bar',
          chartLabel: 'Relative Humidity %',
          backgroundColor: '#90EE90',
          borderColor: '#90EE90',
        },
        {
          id: 'windspeed',
          title: 'Windspeed',
          datapoints: this.apiData.hourly.windspeed_10m,
          chartType: 'bar',
          chartLabel: 'Windspeed km/h',
        },
      ]
    }
  },
  mounted() {
    this.fetchData()
  }
 }
 </script>
 