<template>
<div>
  <!--Stats cards-->

  <div class="row">

    <div class="col-lg-6 col-md-12 col-sm-12">
      <div class="card">
        <div class="header">
          <h4 class="title">Nombres de connectés</h4>
          <p class="category"><span>Sur 24 heures, moyenne lissée sur 10 minutes</span></p>
        </div>
        <div class="content">
          <div style="height:300px;"><canvas ref="chartId" id="chartId"></canvas></div>
        </div>
      </div>
    </div>

    <div class="col-lg-6 col-md-12 col-sm-12">
      <div class="card">
        <div class="header">
          <h4 class="title">Nombres de connectés</h4>
          <p class="category"><span>Sur une semaine, moyenne lissée sur 1h</span></p>
        </div>
        <div class="content">
          <div style="height:300px"><canvas ref="chartId2" id="chartId2"></canvas></div>
        </div>
      </div>
    </div>

    <div class="col-lg-12 col-md-12 col-sm-12">
      <div class="card">
        <div class="header">
          <h4 class="title">Nombres de connectés</h4>
          <p class="category"><span>Sur un mois, moyenne par jour</span></p>
        </div>
        <div class="content">
          <div style="height:300px"><canvas ref="chartId3" id="chartId3"></canvas></div>
        </div>
      </div>
    </div>

  </div>

</div>
</template>
<script>
import axios from 'axios'
import moment from 'moment'
import Chart from 'chart.js'
export default {
  /**
   * Chart data used to render stats, charts. Should be replaced with server data
   */
  data() {
    return {}
  },
  computed: {},
  methods: {
    moment: function(data) {
      return moment(data);
    }
  },
  mounted: function() {
    moment.locale('fr');

    var self = this;
    this.$nextTick(function() {
      axios.get('/api/connected/24h').then(function(response) {
        const ctx = document.getElementById('chartId').getContext('2d');
        ctx.canvas.height = 300;
        new Chart(ctx, {
          type: 'line',
          data: {
            datasets: [{
              label: 'Connectés',
              pointBackgroundColor: 'rgba(0, 119, 220, 0.6)',
              backgroundColor: 'rgba(0, 119, 220, 0.2)',
              borderColor: 'rgba(0, 119, 220, 0.6)',
              fill: 'start',
              data: response.data.map(function(item) {
                  return {x: item.date, y: item.connected};
              })
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              xAxes: [{
                type: "time",
                unitStepSize: 6,
                time: {
                  displayFormats: {
                    'day': 'HH[h]',
                    'hour': 'HH[h]'
                  },
                  tooltipFormat: 'll HH:mm'
                }
              }]
            }
          }
        });

      }, function(response) {
        console.log('error', response);
        repo.error = response.statusText;
      })


      axios.get('/api/connected/week').then(function(response) {
        console.log(self.$refs.chartId)
        const ctx = document.getElementById('chartId2').getContext('2d');
        ctx.canvas.height = 300;
        new Chart(ctx, {
          type: 'line',
          data: {

            datasets: [{
              label: 'Connectés',
              pointBackgroundColor: 'rgba(0, 119, 220, 0.6)',
              backgroundColor: 'rgba(0, 119, 220, 0.2)',
              borderColor: 'rgba(0, 119, 220, 0.6)',
              fill: 'start',
              data: response.data.map(function(item) {
                  return {x: item.date, y: item.connected};
              })
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              xAxes: [{
                type: "time",
                unit: 'day',
                unitStepSize: 6,
                time: {
                  displayFormats: {
                    'day': 'dd HH[h]',
                    'hour': 'dd HH[h]'
                  },
                  tooltipFormat: 'll HH[h]'
                }
              }]
            }
          }
        });

      }, function(response) {
        console.log('error', response);
        repo.error = response.statusText;
      })

      axios.get('/api/connected/month').then(function(response) {
        console.log(self.$refs.chartId)
        console.log("response month", response)
        const ctx = document.getElementById('chartId3').getContext('2d');
        console.log(ctx)
        ctx.canvas.height = 300;
        new Chart(ctx, {
          type: 'line',
          data: {

            datasets: [{
              label: 'Connectés',
              pointBackgroundColor: 'rgba(0, 119, 220, 0.6)',
              backgroundColor: 'rgba(0, 119, 220, 0.2)',
              borderColor: 'rgba(0, 119, 220, 0.6)',
              fill: 'start',
              data: response.data.map(function(item) {
                  return {x: item.date, y: item.connected};
              })
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              xAxes: [{
                type: "time",
                unit: 'day',
                unitStepSize: 6,
                time: {
                  displayFormats: {
                    'weed': 'DD/MM',
                    'day': 'DD/MM',
                    'hour': 'DD/MM'
                  },
                  tooltipFormat: 'll HH:mm:ss'
                }
              }]
            }
          }
        });

      }, function(response) {
        console.log('error', response);
        repo.error = response.statusText;
      })
    });

  },
  beforeDestroy() {

  }
}
</script>
