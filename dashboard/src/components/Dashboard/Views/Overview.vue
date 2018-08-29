<template>
<div>
  <!--Stats cards-->
  <div class="row">
    <div class="col-lg-4 col-sm-6" v-for="stats in statsCards">
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
    <div class="col-md-12">
      <div class="card">
        <div class="header col-md-6">
          <slot name="header">
            <h4 class="title">Liste des 30 derniers topics supprimés</h4>
            <p class="category">Live</p>
          </slot>
        </div>
        <div class="header col-md-6">
          <img class="img-shack" width="75" height="56" src="https://image.noelshack.com/minis/2018/02/2/1515510108-7mv22xd-d.png" alt="https://image.noelshack.com/fichiers/2018/02/2/1515510108-7mv22xd-d.jpg">
        </div>

        <div class="table-responsive">
          <table class="table table-hover topicList">
            <thead>
              <th> </th>
              <th class='hidden-xs'>ID</th>
              <th>Titre</th>
              <th class='hidden-xs'>Auteur</th>
              <th><span class='hidden-xs hidden-sm'>Messages</span><span class='visible-xs-block visible-sm-block'>Msg</span></th>
              <th><span class='hidden-xs'>1ère page</span><span class='visible-xs-block'>1ere</span></th>
              <th class='hidden-xs'>Création</th>
              <th><span class='hidden-xs'>Suppression</span><span class='visible-xs-block'>Suppr.</span></th>
              <th></th>
            </thead>
            <tbody is="transition-group" name="list">
              <tr v-for="topic in topicList" :key="topic.id">
                <td><i v-bind:class="['ti-folder', {'icon-danger': topic.messages > 20 }]"></i></td>
                <td class='hidden-xs'>{{topic.id}}</td>
                <td>{{topic.titre}}</td>
                <td class='hidden-xs'>{{topic.auteur}}</td>
                <td>{{topic.messages}}</td>
                <td>{{topic.datePremierePage}}</td>
                <td class='hidden-xs'>{{topic.dateCreation}}</td>
                <td>{{topic.dateSupression}}</td>
                <td><a target="_blank" v-bind:href="'http://archive.is/http://www.jeuxvideo.com/forums/42-51-' + topic.id + '-*'">Archive.is</a></td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  </div>

  <div class="row">
    <div class="col-xs-12">
      <div class="card">
        <div class="header">
          <h4 class="title">Nombres de topics créés / supprimés par heure</h4>
          <p class="category"><span> Sur 24 heures</span></p>
        </div>
        <div class="content">
          <div style="height:300px;"><canvas ref="chartId2" id="chartId2"></canvas></div>

        </div>
      </div>
    </div>
  </div>

  <div class="row">
    <div class="col-md-12">
      <div class="card">
        <div class="header col-md-6">
          <slot name="header">
            <h4 class="title">Top 10 des plus gros topics supprimés</h4>
            <p class="category">Live</p>
          </slot>
        </div>

        <div class="table-responsive">
          <table class="table table-hover topicList">
            <thead>
              <th> </th>
              <th class='hidden-xs'>ID</th>
              <th>Titre</th>
              <th class='hidden-xs'>Auteur</th>
              <th><span class='hidden-xs hidden-sm'>Messages</span><span class='visible-xs-block visible-sm-block'>Msg</span></th>
              <th><span class='hidden-xs'>1ère page</span><span class='visible-xs-block'>1ere</span></th>
              <th class='hidden-xs'>Création</th>
              <th><span class='hidden-xs'>Suppression</span><span class='visible-xs-block'>Suppr.</span></th>
              <th></th>
            </thead>
            <tbody is="transition-group" name="list">
              <tr v-for="topic in topicTop10List" :key="topic.id">
                <td><i v-bind:class="['ti-folder', {'icon-danger': topic.messages > 20 }]"></i></td>
                <td class='hidden-xs'>{{topic.id}}</td>
                <td>{{topic.titre}}</td>
                <td class='hidden-xs'>{{topic.auteur}}</td>
                <td>{{topic.messages}}</td>
                <td>{{topic.datePremierePage}}</td>
                <td class='hidden-xs'>{{topic.dateCreation}}</td>
                <td>{{topic.dateSupression}}</td>
                <td><a target="_blank" v-bind:href="'http://archive.is/http://www.jeuxvideo.com/forums/42-51-' + topic.id + '-*'">Archive.is</a></td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  </div>
  <!--Charts-->
  <!--<div class="row">

      <div class="col-xs-12">
        <chart-card :chart-data="usersChart.data" :chart-options="usersChart.options">
          <h4 class="title" slot="title">Users behavior</h4>
          <span slot="subTitle"> 24 Hours performance</span>
          <span slot="footer">
            <i class="ti-reload"></i> Updated 3 minutes ago</span>
          <div slot="legend">
            <i class="fa fa-circle text-info"></i> Open
            <i class="fa fa-circle text-danger"></i> Click
            <i class="fa fa-circle text-warning"></i> Click Second Time
          </div>
        </chart-card>
      </div>

      <div class="col-md-6 col-xs-12">
        <chart-card :chart-data="preferencesChart.data"  chart-type="Pie">
          <h4 class="title" slot="title">Email Statistics</h4>
          <span slot="subTitle"> Last campaign performance</span>
          <span slot="footer">
            <i class="ti-timer"></i> Campaign set 2 days ago</span>
          <div slot="legend">
            <i class="fa fa-circle text-info"></i> Open
            <i class="fa fa-circle text-danger"></i> Bounce
            <i class="fa fa-circle text-warning"></i> Unsubscribe
          </div>
        </chart-card>
      </div>

      <div class="col-md-6 col-xs-12">
        <chart-card :chart-data="activityChart.data" :chart-options="activityChart.options">
          <h4 class="title" slot="title">2015 Sales</h4>
          <span slot="subTitle"> All products including Taxes</span>
          <span slot="footer">
            <i class="ti-check"></i> Data information certified</span>
          <div slot="legend">
            <i class="fa fa-circle text-info"></i> Tesla Model S
            <i class="fa fa-circle text-warning"></i> BMW 5 Series
          </div>
        </chart-card>
      </div>

    </div>-->

</div>
</template>
<script>
import StatsCard from 'components/UIComponents/Cards/StatsCard.vue'
import ChartCard from 'components/UIComponents/Cards/ChartCard.vue'
import axios from 'axios'
import moment from 'moment'
import Chart from 'chart.js'
import urlify from 'urlify'

export default {
  components: {
    StatsCard,
    ChartCard
  },
  /**
   * Chart data used to render stats, charts. Should be replaced with server data
   */
  data() {
    return {
      statsCards: [],
      topicList: [],
      topicTop10List: [],
      animate: true,
    }
  },
  computed: {
    transitionTopic: function() {
      return this.animate ? 'list' : 'disabled-list'
    }
  },
  methods: {
    getTopicUrl(id, titre) {
      /*var urlifyOptions = require('urlify').create({
        addEToUmlauts: true,
        szToSs: true,
        spaces: "-",
        nonPrintable: "-",
        trim: true,
        toLower: true
      });

      var titreUrl = urlifyOptions(titre);*/

      /*if (titreUrl.charAt(titreUrl.length - 1) == '-') {
        titreUrl = titreUrl.substr(0, titreUrl.length - 1);
      }*/

      return 'http://archive.is/http://www.jeuxvideo.com/forums/42-51-' + id + '-*';
      //return 'http://archive.is/http://www.jeuxvideo.com/forums/42-51-' + id + '-1-0-1-0-' + titreUrl + '.htm';

    },
    updateDate() {
      console.log("updateDate");
      var repo = this;
      axios.get('/api/day/topics/count').then(function(response) {
        console.log(response.data);
        repo.$set(repo.statsCards, 0, {
          type: 'info',
          icon: 'ti-notepad',
          title: 'Topics créés aujourd\'hui',
          value: response.data.nouveauxTopics,
          footerText: moment().calendar(),
          footerIcon: 'ti-reload'
        });
        repo.$set(repo.statsCards, 1, {
          type: 'danger',
          icon: 'ti-trash',
          title: 'Topics supprimés aujourd\'hui',
          value: response.data.topicsSupprimes,
          footerText: moment().calendar(),
          footerIcon: 'ti-reload'
        });
        repo.$set(repo.statsCards, 2, {
          type: 'danger',
          icon: 'ti-email',
          title: 'Messages des topics supprimés',
          value: response.data.messagesTopicsSupprimes,
          footerText: moment().calendar(),
          footerIcon: 'ti-reload'
        });
      }, function(response) {
        console.log('error', response);
        repo.error = response.statusText;
      })
    },
    updateTopicList() {
      console.log("updateDate");
      var repo = this;
      axios.get('/api/day/topics/deleted/last').then(function(response) {
        console.log(response.data);
        response.data.forEach((album, index) => {
          if (response.data[index].dateCreation) {
            const now = moment();
            const formattedDate = moment(response.data[index].dateCreation);
            if (now.isSame(formattedDate, 'day'))
              response.data[index].dateCreation = formattedDate.format('HH:mm');
            else
              response.data[index].dateCreation = formattedDate.format('DD/MM');
          } else
            response.data[index].dateCreation = '';

          if (response.data[index].dateSupression) {
            const now = moment();
            const formattedDate = moment(response.data[index].dateSupression);
            if (now.isSame(formattedDate, 'day'))
              response.data[index].dateSupression = formattedDate.format('HH:mm');
            else
              response.data[index].dateSupression = formattedDate.format('DD/MM');
          } else
            response.data[index].dateSupression = '';

          if (response.data[index].datePremierePage) {
            const now = moment();
            const formattedDate = moment(response.data[index].datePremierePage);
            if (now.isSame(formattedDate, 'day'))
              response.data[index].datePremierePage = formattedDate.format('HH:mm');
            else
              response.data[index].datePremierePage = formattedDate.format('DD/MM');
          } else
            response.data[index].datePremierePage = '';
        });
        repo.topicList = response.data;
        repo.animate = true;
      }, function(response) {
        console.log('error', response);
        repo.error = response.statusText;
      })
    },
    updateTopicTop10List() {
      console.log("updateDate");
      var repo = this;
      axios.get('/api/day/topics/deleted/top10').then(function(response) {
        console.log(response.data);
        response.data.forEach((album, index) => {
          if (response.data[index].dateCreation) {
            const now = moment();
            const formattedDate = moment(response.data[index].dateCreation);
            if (now.isSame(formattedDate, 'day'))
              response.data[index].dateCreation = formattedDate.format('HH:mm');
            else
              response.data[index].dateCreation = formattedDate.format('DD/MM');
          } else
            response.data[index].dateCreation = '';

          if (response.data[index].dateSupression) {
            const now = moment();
            const formattedDate = moment(response.data[index].dateSupression);
            if (now.isSame(formattedDate, 'day'))
              response.data[index].dateSupression = formattedDate.format('HH:mm');
            else
              response.data[index].dateSupression = formattedDate.format('DD/MM');
          } else
            response.data[index].dateSupression = '';

          if (response.data[index].datePremierePage) {
            const now = moment();
            const formattedDate = moment(response.data[index].datePremierePage);
            if (now.isSame(formattedDate, 'day'))
              response.data[index].datePremierePage = formattedDate.format('HH:mm');
            else
              response.data[index].datePremierePage = formattedDate.format('DD/MM');
          } else
            response.data[index].datePremierePage = '';
        });
        repo.topicTop10List = response.data;
        repo.animate = true;
      }, function(response) {
        console.log('error', response);
        repo.error = response.statusText;
      })
    },
    updateConnected() {
      console.log("updateConnected");
      var repo = this;
      axios.get('/api/connected/last').then(function(response) {
        console.log(response.data);
        console.log(moment(response.data.date).calendar()),
          repo.$set(repo.statsCards, 3, {
            type: 'info',
            icon: 'ti-user',
            title: 'Forumeurs connectés',
            value: response.data.connected,
            footerText: moment(response.data.date).calendar(),
            footerIcon: 'ti-reload'
          });
      }, function(response) {
        console.log('error', response);
        repo.error = response.statusText;
      })
    }
  },
  mounted: function() {
    moment.locale('fr')
    this.updateDate();
    this.updateTopicList();
    this.updateTopicTop10List();
    this.interval = {};
    this.interval.updateTopicList = setInterval(this.updateTopicList, 10000);
    this.interval.updateTopicTop10List = setInterval(this.updateTopicTop10List, 120000);
    this.interval.updateDate = setInterval(this.updateDate, 16000);
    //this.updateConnected();
    //setInterval(this.updateConnected, 7000);
    var self = this;

    this.$nextTick(function() {
      axios.all([axios.get('/api/stats/topics/created/hourly'),
          axios.get('/api/stats/topics/deleted/hourly')
        ])
        .then(axios.spread((created, deleted) => {
          var ctx = document.getElementById('chartId2').getContext('2d');
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
                  return { x: item.date, y: item.nombre };
                })
              }, {
                label: 'Supprimés',
                pointBackgroundColor: 'rgba(247, 51, 12, 0.6)',
                backgroundColor: 'rgb(247, 51, 12, 0.2)',
                borderColor: 'rgba(247, 51, 12, 0.6)',
                fill: 'start',
                data: deleted.data.map(function(item) {
                  return { x: item.date, y: item.nombre };
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
                    unit: 'hour',
                    round: 'hour',
                    tooltipFormat: 'll H[h]',
                    displayFormats: {
                      hour: 'H[h]'
                    }
                  }
                }]
              }
            }
          });
        })).catch(error => console.log(error));
    });
    // Create a new line chart object where as first parameter we pass in a selector
    // that is resolving to our chart container element. The Second parameter
    // is the actual data object.
  },
  beforeDestroy() {
    clearInterval(this.interval.updateTopicList);
    clearInterval(this.interval.updateTopicTop10List);
    clearInterval(this.interval.updateDate);
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

.topicList > tbody > tr > td,
.topicList > tbody > tr > td,
.topicList > tbody > tr > th,
.topicList > tfoot > tr > td,
.topicList > tfoot > tr > th,
.topicList > thead > tr > td {
    padding: 6px;
    vertical-align: middle;
}

@media screen and (max-width: 767px) {
    .table-responsive > .table > tbody > tr > td,
    .table-responsive > .table > tbody > tr > th,
    .table-responsive > .table > tfoot > tr > td,
    .table-responsive > .table > tfoot > tr > th,
    .table-responsive > .table > thead > tr > td,
    .table-responsive > .table > thead > tr > th {
        white-space: initial;
    }
}
</style>
