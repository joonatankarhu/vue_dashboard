<template>
  <v-container fill-height :class="smallScreen ? 'px-0 py-8' : ''">
    <v-layout 
      class="d-flex column col-12" 
      align-center 
      justify-center
      :class="smallScreen ? 'pa-0' : ''"
    >
        <v-card 
          class="col-12 mb-10"
          :class="smallScreen ? '' : 'pa-5'"
        >
          <v-card-title 
            class="headline mb-5"
            :class="smallScreen ? 'text-h4' : 'text-h3'"
          >
            Dashboard
          </v-card-title>
          <v-select
            class="pl-5"
            label="Charts"
            v-model="selectedCharts"
            :items="selectOptions"
            @input="handleChartSelection"
            multiple
          ></v-select>
        </v-card>
        <v-container>
          <v-row>
            <v-col
              v-for="(chart, index) in charts"
              v-if="chart.show"
              :key="'chart' + index"
              :cols="smallScreen ? 12 : 6"
              class="d-flex"
              :class="smallScreen ? 'px-0' : 'px-5'"
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
      charts: [],
      selectedCharts: ['Temperature', 'Humidity'],
      selectOptions: ['Temperature', 'Humidity', 'Windspeed', 'Mixed Chart']
      // dataFetched: false,
    }
  },
  computed: {
    todaysDate() {
      const today = new Date();

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
      const maxDate = year + "-" + month + "-" + day.slice(0, -1) + 5;
      return maxDate
      
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
    handleChartSelection(selectedValues) {
      this.selectedCharts = selectedValues;
    },
    createCharts() {
      this.charts = [
        {
          show: this.chartIsSelected('Temperature'),
          id: 'temperature',
          title: 'Temperatures',
          datapoints: this.apiData.hourly.temperature_2m,
          chartType: 'bar',
          chartLabel: 'Celsius °C',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgb(54, 162, 235)',
        },
        {
          show: this.chartIsSelected('Humidity'),
          id: 'humidity',
          title: 'Humidity',
          datapoints: this.apiData.hourly.relativehumidity_2m,
          chartType: 'bar',
          chartLabel: 'Relative Humidity %',
          backgroundColor: '#90EE90',
          borderColor: '#90EE90',
        },
        {
          show: this.chartIsSelected('Windspeed'),
          id: 'windspeed',
          title: 'Windspeed',
          datapoints: this.apiData.hourly.windspeed_10m,
          chartType: 'bar',
          chartLabel: 'km/h',
        },
        {
          show: this.chartIsSelected('Mixed Chart'),
          id: 'mixChart',
          title: 'Mixed Chart',
          datapoints: this.apiData.hourly.windspeed_10m,
          chartType: 'bar',
          chartLabel: 'Mixed',
        },
      ]
    },
    chartIsSelected(name) {
      return this.selectedCharts.find(chart => chart == name)
    },
  },
  watch: {
    selectedCharts: {
      handler() {
        this.createCharts()
      }
    }
  },
  mounted() {
    this.fetchData()
  }
 }
 </script>