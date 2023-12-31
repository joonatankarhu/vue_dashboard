<template>
  <v-card class="col-12" :class="smallScreen ? '' : 'pa-5'">
    <h3>{{ title }}</h3>
    <canvas :id="chartId"></canvas>
    <div class="flex-column pa-10">
      <div class="d-flex justify-between align-center col-12">
        <span class="mr-5">
          <span>Start:</span>
          <input 
            id="start"
            type="date" 
            :min="todaysDate"
            :max="maxDate"
            :value="startValue"
          />
        </span>
        <span>
          <span>End:</span>
          <input 
            id="end"
            type="date" 
            :min="todaysDate"
            :max="maxDate"
            :value="endValue"
          />
          </span>
      </div>
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
        dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        startValue: '',
        endValue: ''
      };
    },
    computed: {
      convertedDates() {
        return this.InitChartData.dates.map((date) => new Date(date).setHours(0, 0, 0, 0));
      },
      filteredDates() {
        const startDate = new Date(this.startValue);
        const start = startDate.setHours(0, 0, 0, 0)

        const endDate = new Date(this.endValue);
        const end = endDate.setHours(0, 0, 0, 0)
        
        const filteredDates = this.convertedDates.filter(date => date >= start && date <= end)

        this.startValue = this.todaysDate
        this.endValue = this.todaysDate

        return filteredDates
      },
      todaysDate() {
        const today = new Date();
        today.setDate(today.getDate());

        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
      },
      maxDate() {
        const today = new Date();
        today.setDate(today.getDate() + 3);

        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');month
        const day = String(today.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
      },
      datesAreSame() {
        console.log(' this.endValue', this.endValue);
        console.log(' this.todaysDate', this.todaysDate);

        return this.endValue == this.todaysDate
      }
    },
    methods: {
      formattedDays(dates) {
        return dates.map((date, index) => {
          if (this.datesAreSame) {
            return index
          } else {
            const day = new Date(date).getDay()
            const dayName = this.dayNames[day]
            return dayName
          }
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
        const startDate = new Date(this.startValue);
        const start = startDate.setHours(0, 0, 0, 0)

        const endDate = new Date(this.endValue);
        const end = endDate.setHours(0, 0, 0, 0)
        
        const filteredDates = this.convertedDates.filter(date => date >= start && date <= end)

        this.chart.config.data.labels = filteredDates


        const startArr = this.convertedDates.indexOf(this.filteredDates[0])
        const endArr = this.convertedDates.indexOf(this.filteredDates[this.filteredDates.length -1])

        const copyDatapoints = [...this.InitChartData.datapoints]
        copyDatapoints.splice(endArr + 1, this.filteredDates.length)
        copyDatapoints.splice(0, startArr)

        this.chart.config.data.datasets[0].data = copyDatapoints

        this.chart.update()

      },
      resetDate() {
        this.endValue = this.maxDate
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
      this.startValue = this.todaysDate
      this.endValue = this.todaysDate
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