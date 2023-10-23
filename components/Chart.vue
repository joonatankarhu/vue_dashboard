<template>
  <v-card class="col-12" :class="smallScreen ? '' : 'pa-5'">
    <h3>{{ title }}</h3>
    <canvas :id="chartId"></canvas>
    <div class="flex-column pa-10">
      <v-row class="flex-column justify-center align-center col-12">
        <span class="mr-2">Start:</span>
        <input 
          id="start"
          type="date" 
          :min="todaysDate"
          :max="maxDate"
          :value="todaysDate"
        />
        <span>End:</span>
        <input 
          id="end"
          type="date" 
          :min="todaysDate"
          :max="maxDate"
          :value="maxDate"
        />
      </v-row>
      <v-row class="pt-5">
        <v-col class="d-flex items-center justify-center px-10"
        :class="smallScreen ? 'col-12' : 'col-6'">
          <v-btn @click="filterDates" color="secondary" class="mr-5">
            Filter
          </v-btn>
          <v-btn @click="isChangingColor = true" color="primary">
          Color
            <EditColorDialog 
              :selectedColor="selectedColor"
              :isChangingColor="isChangingColor" 
              @update-color="(event) => updateColor(event)" 
              @close-dialog="closeDialog" 
            />
          </v-btn>
        </v-col>
        <v-col class="d-flex items-center justify-center" :class="smallScreen ? 'col-12' : 'col-3'">
          <v-select
            label="Chart type"
            density="compact"
            v-model="selectedChartType"
            :items="['bar', 'line']"
            variant="solo"
            :style="smallScreen ? '' : 'max-width: 100px;'"
          ></v-select>
        </v-col>
        <v-col class="d-flex items-center justify-center"
        :class="smallScreen ? 'col-12' : 'col-3'">
          <v-btn @click="resetDate" class="col-6">
            Reset
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<script>
import Chart from 'chart.js'
import EditColorDialog from './EditColorDialog.vue';
import 'chartjs-adapter-date-fns';

export default {
    name: 'Chart',
    props: [
      'chartId',
      'title',
      'smallScreen',
      'defaultColor',
      'dates',
      'datapoints',
      'chartLabel',
    ],
    components: { EditColorDialog },
    data() {
      return {
        chart: {
          config: {
            type: 'bar',
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
        isChangingColor: false,
        selectedColor: this.defaultColor,
        InitChartData: {
            dates: this.dates,
            datapoints: this.datapoints,
        },
        dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
      };
    },
    computed: {
      convertedDates() {
        return this.InitChartData.dates.map((date) => new Date(date).setHours(0, 0, 0, 0));
      },
      filteredDates() {
        const startDate = new Date(document.getElementById('start').value);
        const start = startDate.setHours(0, 0, 0, 0)

        const endDate = new Date(document.getElementById('end').value);
        const end = endDate.setHours(0, 0, 0, 0)
        
        const filteredDates = this.convertedDates.filter(date => date >= start && date <= end)


        return filteredDates
      },
      filteredDatapoints() {
        const startArr = this.convertedDates.indexOf(this.filteredDates[0])
        const endArr = this.convertedDates.indexOf(this.filteredDates[this.filteredDates.length -1])

        const copyDatapoints = [...this.InitChartData.datapoints]
        copyDatapoints.splice(endArr + 1, this.filteredDates.length)
        copyDatapoints.splice(0, startArr)

        return copyDatapoints
      },
      todaysDate() {
        const today = new Date();
        today.setDate(today.getDate()); // Add 5 days to the current date

        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Ensure 2-digit month
        const day = String(today.getDate()).padStart(2, '0'); // Ensure 2-digit day

        return `${year}-${month}-${day}`;
      },
      maxDate() {
        const today = new Date();
        today.setDate(today.getDate() + 3); // Add 5 days to the current date

        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Ensure 2-digit month
        const day = String(today.getDate()).padStart(2, '0'); // Ensure 2-digit day

        return `${year}-${month}-${day}`;
      }
    },
    methods: {
      formattedDays(list) {
        return list.map((date, i) => {
          const day = new Date(date).getDay()
          const name = this.dayNames[day]

          return name
        })
      },
      initChartValues() {
        this.chart.config.data.labels = this.formattedDays(this.filteredDates)
        this.chart.config.data.datasets.push({
          label: this.chartLabel,
          data: this.InitChartData.datapoints,
          backgroundColor: this.selectedColor,
          borderColor: this.selectedColor,
          borderWidth: 1
        });

        const copyDatapoints = [...this.InitChartData.datapoints];

        const startArr = this.convertedDates.indexOf(this.filteredDates[0])
        const endArr = this.convertedDates.indexOf(this.filteredDates[this.filteredDates.length -1])

        copyDatapoints.splice(endArr + 1, this.filteredDates.length);
        copyDatapoints.splice(0, startArr);
        
        this.chart.config.data.datasets[0].data = copyDatapoints;

        const ctx = document.getElementById(this.chartId);
        this.chart = new Chart(ctx, this.chart.config);
      },
      filterDates() {
        this.chart.config.data.labels = this.formattedDays(this.filteredDates)
        this.chart.config.data.datasets[0].data = this.filteredDatapoints

        this.chart.update()
      },
      resetDate() {
        this.chart.config.data.labels = this.formattedDays(this.convertedDates)
        this.chart.config.data.datasets[0].data = this.InitChartData.datapoints

        this.chart.update()
      },
      updateColor(newColor) {
        this.chart.config.data.datasets[0].backgroundColor = newColor;
        this.chart.config.data.datasets[0].borderColor = newColor;

        this.closeDialog()

        this.chart.update();
      },
      closeDialog() {
        this.isChangingColor = false
      }
    },
    watch: {
      selectedChartType: {
        handler() {
          this.chart.config.type = this.selectedChartType;
          this.chart.update();
        }
      },
    },
    mounted() {
      this.initChartValues();
    }
}
</script>

<style scoped>
.row + .row {
  margin: 0px !important;
}

* {
  box-sizing: border-box;
}
</style>