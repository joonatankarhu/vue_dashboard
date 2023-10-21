<template>
  <v-card class="col-12" :class="smallScreen ? '' : 'pa-5'">
    <h3>{{ title }}</h3>
    <canvas :id="chartId"></canvas>
    <div>
      <v-container class="d-flex align-center pt-5"
      :class="smallScreen ? 'flex-column justify-center' : 'justify-between'"
      >
        <v-row class="d-flex align-center justify-center"
        :class="smallScreen ? '' : 'pr-5'"
        >
          <v-col class="d-flex align-center">
            <span class="mr-1">Start:</span>
            <input 
              id="start"
              type="date" 
              :min="minDate"
              :max="maxDate"
              :value="minDate"
            />
          </v-col>
        </v-row>
        <v-row class="d-flex align-center justify-center">
          <v-col class="d-flex align-center justify-end">
            <span class="mr-1">End:</span>
            <input 
              id="end"
              type="date" 
              :min="minDate"
              :max="maxDate"
              :value="defaultMaxDate"
            />
          </v-col>
        </v-row>
      </v-container>
      <div 
        class="d-flex align-center pb-5 col-12" :class="smallScreen ? 'flex-column justify-center' : 'justify-space-between'">
        <v-row class="d-flex align-center">
          <v-btn 
            class="mr-5" 
            @click="filterDates"
            color="secondary"
          >
            Filter
          </v-btn>
          <v-btn @click="resetDate">
            Reset
          </v-btn>
        </v-row>
        <v-select
          label="Chart type"
          density="compact"
          v-model="selectedChartType"
          :items="['bar', 'line']"
          variant="solo"
          :style="smallScreen ? 'padding-top: 40px' : 'max-width: 125px;'"
        ></v-select>
      </div>
    </div>
  </v-card>
</template>

<script>
import Chart from 'chart.js'
import 'chartjs-adapter-date-fns';

export default {
  name: 'Chart',
  props: [
    'chartId',
    'title',
    'minDate', 
    'maxDate', 
    'dates', 
    'datapoints', 
    'chartType', 
    'chartLabel', 
    'backgroundColor',
    'borderColor'
  ],
  data() {
    return {
      chart: {
        config: {
          type: this.chartType,
          data: {
            labels: [],
            datasets: []
          },
          options: {
            scales: {
              x: {
                type: 'time',
                time: {
                  unit: 'day'
                }
              },
              y: {
                beginAtZero: true
              }
            }
          },
        },
      },
      selectedChartType: 'bar',
      InitChartData: {
        dates: [],
        datapoints: [],
      }
    }
  },
  computed: {
    convertedDates() {
      return this.InitChartData.dates.map((date) => new Date(date))
    },
    defaultMaxDate() {
      const today = new Date();

      const year = today.toLocaleString("default", { year: "numeric" });
      const month = today.toLocaleString("default", { month: "2-digit" });
      const day = today.toLocaleString("default", { day: "2-digit" });

      // Generate yyyy-mm-dd date string
      const maxDate = year + "-" + month + "-" + day.slice(0, -1) + 2;
      return maxDate
      
    },
    smallScreen() {
      return this.$vuetify.breakpoint.smAndUp == false
    },
    filteredDates() {
      const startDate = new Date(document.getElementById('start').value)
      const endDate = new Date(document.getElementById('end').value)

      return this.convertedDates.filter((date) => date >= startDate && date <= endDate)
    },
    filteredDatapoints() {
      return this.InitChartData.datapoints.filter((_, index) => {
        return index >= this.convertedDates.indexOf(this.filteredDates[0]) && index <= this.convertedDates.indexOf(this.filteredDates[this.filteredDates.length - 1]);
      });
    },
    startArr() {
      return this.convertedDates.indexOf(this.filteredDates[0])
    },
    endArr() {
      return this.convertedDates.indexOf(this.filteredDates[this.filteredDates.length -1])
    }
  },
  methods: {
    initDates() {
       // Init chart values
      this.chart.config.data.labels = this.filteredDates.map((date) => date.getHours())
      
      this.chart.config.data.datasets.push({
        label: this.chartLabel,
        data: this.filteredDatapoints,
        backgroundColor: this.backgroundColor,
        borderColor: this.borderColor,
        borderWidth: 1
      })

      const copyDatapoints = [...this.InitChartData.datapoints]
        copyDatapoints.splice(this.endArr + 1, this.filteredDates.length)
        copyDatapoints.splice(0, this.startArr)

      this.chart.config.data.datasets[0].data = copyDatapoints

      const ctx = document.getElementById(this.chartId);
      this.chart = new Chart(ctx, this.chart.config);
    },  
    filterDates() {
      this.chart.config.data.labels = this.filteredDates.map((date) => date.getHours())
      this.chart.config.data.datasets[0].data = this.filteredDatapoints;

      const startArr = this.convertedDates.indexOf(this.filteredDates[0])
      const endArr = this.convertedDates.indexOf(this.filteredDates[this.filteredDates.length -1])

      const copyDatapoints = [...this.InitChartData.datapoints]
      copyDatapoints.splice(endArr + 1, this.filteredDates.length)
      copyDatapoints.splice(0, startArr)

      this.chart.config.data.datasets[0].data = copyDatapoints

      this.chart.update()
    },
    resetDate() {
      this.chart.config.data.labels = this.convertedDates.map(date => new Date(date).getHours())
      this.chart.config.data.datasets[0].data = this.InitChartData.datapoints

      this.chart.update()
    },
  },
  watch: {
    selectedChartType: {
      handler() {
        this.chart.config.type = this.selectedChartType
        this.chart.update()
      }
    }
  },
  mounted() {
    this.InitChartData.dates = this.dates
    this.InitChartData.datapoints = this.datapoints

    this.initDates()  
  }
}
</script>

<style scoped>
.row + .row {
  margin: 0px !important;
}
</style>