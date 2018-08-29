<template>
<div>
  <!--Stats cards-->

  <h2 class="media-heading">Depuis le <small>{{dateDebut}}</small></h2>
  <div class="row">
    <div class="col-lg-4 col-md-6 col-sm-6 col-sm-12" v-for="stats in statsCards">
      <stats-card>
        <div class="icon-big text-center" :class="`icon-${stats.type}`" slot="header">
          <i :class="stats.icon"></i>
        </div>
        <div class="numbers" slot="content">
          <p>{{stats.title}}</p>
          <transition name="slide-fade" mode="in-out">
            <div>{{stats.value}}</div>
          </transition>
        </div>
        <div class="stats" slot="footer">

          <i :class="stats.footerIcon" :key="stats.footerText"></i> {{stats.footerText}}

        </div>
      </stats-card>
    </div>
  </div>

  <div class="row">

    <div class="col-lg-12 col-md-12 col-sm-12">
      <div class="card">
        <div class="header">
          <h4 class="title">Nombres de topics créés / supprimés</h4>
          <p class="category"><span>Sur 1 mois, par jour</span></p>
        </div>
        <div class="content">
          <div style="height:300px;"><canvas ref="chartId" id="chartId"></canvas></div>
        </div>
      </div>
    </div>

  </div>

</div>
</template>
<script>
import StatsCard from 'components/UIComponents/Cards/StatsCard.vue'

import axios from 'axios'
import moment from 'moment'
import Chart from 'chart.js'
export default {
  components: {
    StatsCard,
  },
  data() {
    return {
      statsCards: [],
      dateDebut: ''
    }
  },
  computed: {},
  methods: {
    moment: function(data) {
      return moment(data);
    },
    updateDate() {
      console.log("updateDate");
      var repo = this;
      axios.get('/api/stats/count').then(function(response) {
        console.log(response.data);
        repo.dateDebut = moment(response.data.startDate).format('LLL');
        repo.$set(repo.statsCards, 0, {
          type: 'info',
          icon: 'ti-notepad',
          title: 'Topic créés',
          value: response.data.totalNouveauxTopics,
          footerText: moment().calendar(),
          footerIcon: 'ti-reload'
        });
        /*  repo.$set(repo.statsCards, 1, {
          type: 'info',
          icon: 'ti-notepad',
          title: 'Topic analysés',
          value: response.data.totalTopics,
          footerText: moment().calendar(),
          footerIcon: 'ti-reload'
        });*/
        repo.$set(repo.statsCards, 1, {
          type: 'danger',
          icon: 'ti-trash',
          title: 'Topics supprimés',
          value: response.data.totalTopicsSupprimes,
          footerText: moment().calendar(),
          footerIcon: 'ti-reload'
        });
        repo.$set(repo.statsCards, 2, {
          type: 'danger',
          icon: 'ti-email',
          title: 'Messages des topics supprimés',
          value: response.data.totalMessagesSupprimes,
          footerText: moment().calendar(),
          footerIcon: 'ti-reload'
        });
      }, function(response) {
        console.log('error', response);
        repo.error = response.statusText;
      })
    },
  },
  mounted: function() {
    moment.locale('fr')
    this.updateDate();
    var self = this;
    this.$nextTick(function() {
      axios.all([axios.get('/api/stats/topics/created/daily'),
          axios.get('/api/stats/topics/deleted/daily')
        ])
        .then(axios.spread((created, deleted) => {
          var ctx = document.getElementById('chartId').getContext('2d');
          ctx.canvas.height = 300;
          new Chart(ctx, {
            type: 'line',
            data: {
              datasets: [{
                label: 'Créés',
                pointBackgroundColor: 'rgba(0, 119, 220, 0.6)',
                backgroundColor: 'rgba(0, 119, 220, 0.2)',
                borderColor: 'rgba(0, 119, 220, 0.6)',
                fill: 'start',
                data: created.data.map(function(item) {
                  return {x: item.date, y: item.nombre};
                })
              }, {
                label: 'Supprimés',
                pointBackgroundColor: 'rgba(247, 51, 12, 0.6)',
                backgroundColor: 'rgb(247, 51, 12, 0.2)',
                borderColor: 'rgba(247, 51, 12, 0.6)',
                fill: 'start',
                data: deleted.data.map(function(item) {
                  return {x: item.date, y: item.nombre};
                })
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                xAxes: [{
                  type: "time",
                  time: {
                    unit: 'day',
                    round: 'day',
                    tooltipFormat: 'll',
                    displayFormats: {
                      day: 'DD/MM'
                    }
                  }
                }]
              }
            }
          });
        })).catch(error => console.log(error));
    });


  },
  beforeDestroy() {

  }
}
</script>
<style lang="scss" scoped>
.slide-fade-enter-active {
    transition: all 0.3s ease;
}
.slide-fade-leave-active {
    transition: all 0.8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
/* .slide-fade-leave-active for <2.1.8 */
.slide-fade-enter,
.slide-fade-leave-to {
    transform: translateX(10px);
    opacity: 0;
}

.list-enter-active {
    transition: background 15s , transform 1s;

}
.list-enter {
    background: #dfedfb;
}
</style>
