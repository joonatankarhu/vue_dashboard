<template>
  <v-card>
    <canvas id="chart"></canvas>
    <div>
      <v-container class="d-flex align-center justify-center py-5">
        <div class="d-flex align-center justify-center">
          <span>Start:</span>
          <input 
            id="start"
            type="date" 
            :min="minDate"
            :max="maxDate"
            :value="minDate"
          />
        </div>
        <div class="d-flex align-center justify-center ml-5">
          <span>End:</span>
          <input 
            id="end"
            type="date" 
            :min="minDate"
            :max="maxDate"
            :value="maxDate"
          />
        </div>
      </v-container>
      <div class="d-flex align-center justify-center pb-5">
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
    'minDate', 
    'maxDate', 
    'dates', 
    'datapoints', 
    'chartType', 
    'chartLabel', 
    'backgroundColors',
    'borderColor'
  ],
  data() {
    return {
      chart: {},
      data: {
        dates: [],
        datapoints: []
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
      return this.data.dates.map((date) => new Date(date).setHours(0, 0, 0, 0))
    }
  },
  methods: {
    filterDates() {
      const startDate = new Date(document.getElementById('start').value)
      const start = startDate.setHours(0, 0, 0, 0)

      const endDate = new Date(document.getElementById('end').value)
      const end = endDate.setHours(0, 0, 0, 0)

      const filteredDates = this.convertedDates.filter(date => date >= start && date <= end)

      // Format filteredDates to display only the day
      const formattedFilteredDates = filteredDates.map((date) => format(date, 'eeee d'))
      this.chart.config.data.labels = formattedFilteredDates

      const startArr = this.convertedDates.indexOf(filteredDates[0])
      const endArr = this.convertedDates.indexOf(filteredDates[filteredDates.length -1])

      const copyDatapoints = [...this.data.datapoints]
      copyDatapoints.splice(endArr + 1, filteredDates.length)
      copyDatapoints.splice(0, startArr)

      this.chart.config.data.datasets[0].data = copyDatapoints

      this.chart.update()
    },
    resetDate() {
      this.chart.config.data.labels = this.convertedDates
      this.chart.config.data.datasets[0].data = this.data.datapoints

      this.chart.update()
    }
  },
  mounted() {
    this.data.dates = this.dates
    this.data.datapoints = this.datapoints

    this.config.data.labels = this.data.dates.map(date => date);
    this.config.data.datasets.push({
      label: this.chartLabel,
      data: this.data.datapoints.map(datapoint => datapoint),
      backgroundColor: this.backgroundColors,
      borderColor: this.borderColor,
      borderWidth: 1
    });


    const ctx = document.getElementById('chart');
    this.chart = new Chart(ctx, this.config);
  }
}
</script>