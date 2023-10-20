<template>
  <v-card class="pa-5 col-12">
    <h3>{{ title }}</h3>
    <canvas :id="chartId"></canvas>
    <div>
      <v-container class="d-flex align-center justify-between pt-5 pb-5">
        <div class="d-flex align-center justify-center pr-5">
          <span>Start:</span>
          <input 
            id="start"
            type="date" 
            :min="minDate"
            :max="maxDate"
            :value="minDate"
          />
        </div>
        <div class="d-flex align-center justify-center">
          <span>End:</span>
          <input 
            id="end"
            type="date" 
            :min="minDate"
            :max="maxDate"
            :value="minDate"
          />
        </div>
      </v-container>
      <div class="d-flex align-center pb-5">
        <v-btn class="mr-5" @click="filterDates">
          Filter
        </v-btn>
        <v-btn @click="resetDate">
          Reset
        </v-btn>
      </div>
    </div>
  </v-card>
</template>

<script>
import Chart from 'chart.js'
import 'chartjs-adapter-date-fns';
import format from 'date-fns/format';

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
      chart: {},
      data: {
        dates: [],
        datapoints: [],
        dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ],
        days: []
      },
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
    }
  },
  computed: {
    convertedDates() {
      return this.data.dates.map((date) => new Date(date))
    },
  },
  methods: {
    filterDates() {
      const startDate = new Date(this.minDate)
      const start = startDate.setHours(0, 0, 0, 0)

      const endDate = new Date(this.minDate)
      const end = endDate.setHours(24, 0, 0, 0)

      const filteredDates = this.convertedDates.filter(date => date >= start && date <= end)
      const filteredDataPoints = this.data.datapoints.filter((_, index) => {
        return index >= this.convertedDates.indexOf(filteredDates[0]) && index <= this.convertedDates.indexOf(filteredDates[filteredDates.length - 1]);
      });

      const formattedFilteredDates = filteredDates.map((date) => format(date, 'HH'))

      this.chart.config.data.labels = formattedFilteredDates
      this.chart.config.data.datasets[0].data = filteredDataPoints;

      const startArr = this.convertedDates.indexOf(filteredDates[0])
      const endArr = this.convertedDates.indexOf(filteredDates[filteredDates.length -1])

      const copyDatapoints = [...this.data.datapoints]
      copyDatapoints.splice(endArr + 1, filteredDates.length)
      copyDatapoints.splice(0, startArr)

      this.chart.config.data.datasets[0].data = copyDatapoints

      this.chart.update()
    },
    resetDate() {
      this.chart.config.data.labels = this.convertedDates.map(date => new Date(date).getHours())
      this.chart.config.data.datasets[0].data = this.data.datapoints

      this.chart.update()
    }
  },
  mounted() {
    this.data.dates = this.dates
    this.data.datapoints = this.datapoints

    // Init chart values
    const initLabelValues = this.data.dates.map(date => new Date(date).getHours())
    this.config.data.labels = initLabelValues
    
    this.config.data.datasets.push({
      label: this.chartLabel,
      data: this.data.datapoints.map(datapoint => datapoint),
      backgroundColor: this.backgroundColor,
      borderColor: this.borderColor,
      borderWidth: 1
    });


    const ctx = document.getElementById(this.chartId);
    this.chart = new Chart(ctx, this.config);
  }
}
</script>