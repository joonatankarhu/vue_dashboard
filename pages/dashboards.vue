<template>
  <v-container fill-height>
     <v-layout align-center justify-center>
       <v-flex xs12 sm8 md6>
         <v-card>
          <v-card-title class="headline">
            Dashboard
          </v-card-title>
       </v-card>
       <!-- <Chart 
        minDate="2010-11-01" 
        maxDate="2010-11-07"  
        :dates="[
          '2010-11-01',
          '2010-11-02',
          '2010-11-03',
          '2010-11-04',
          '2010-11-05',
          '2010-11-06',
          '2010-11-07'
        ]"
        :datapoints="[50, 25, 35, 25, 22, 30, 28]"
        chartType="bar"
        chartLabel="temperature"
        :backgroundColors="['rgba(54, 162, 235, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(54, 162, 235, 0.2)']"
        :borderColor="['rgb(54, 162, 235)', 'rgb(54, 162, 235)', 'rgb(54, 162, 235)', 'rgb(54, 162, 235)', 'rgb(54, 162, 235)', 'rgb(54, 162, 235)', 'rgb(54, 162, 235)']"
      /> -->

      <Chart 
        :props="chartOne"
      />
       
       </v-flex>
     </v-layout>
   </v-container>
 </template>
 
 <script>
 import Chart from '../components/Chart.vue'
// import axios from 'axios';

 export default {
   name: 'Dashboards',
   components: {
    Chart
   },
   data() {
    return {
      chartOne: {
        minDate: "2010-11-01", 
        maxDate: "2010-11-07",  
        dates: [
          '2010-11-01',
          '2010-11-02',
          '2010-11-03',
          '2010-11-04',
          '2010-11-05',
          '2010-11-06',
          '2010-11-07'
        ],
        datapoints: [50, 25, 35, 25, 22, 30, 28],
        chartType: "bar",
        chartLabel: "temperature",
        backgroundColors: ['rgba(54, 162, 235, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(54, 162, 235, 0.2)'],
        borderColor: ['rgb(54, 162, 235)', 'rgb(54, 162, 235)', 'rgb(54, 162, 235)', 'rgb(54, 162, 235)', 'rgb(54, 162, 235)', 'rgb(54, 162, 235)', 'rgb(54, 162, 235)']
      }
    }
   },
   methods: {
      // async fetchData() {
      //     const response = await axios.get('https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,windspeed_10m&hourly=temperature_2m,relativehumidity_2m,windspeed_10m');
          
      //     this.apiData = response.data;
   }
   // apiData: null,
      // dataFetched: false,

 }
 </script>
 