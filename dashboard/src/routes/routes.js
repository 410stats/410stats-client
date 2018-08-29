import DashboardLayout from '../components/Dashboard/Layout/DashboardLayout.vue'
// GeneralViews
import NotFound from '../components/GeneralViews/NotFoundPage.vue'

// Admin pages
import Overview from 'src/components/Dashboard/Views/Overview.vue'
import Affluence from 'src/components/Dashboard/Views/Affluence.vue'
import Statistiques from 'src/components/Dashboard/Views/Statistiques.vue'
import Changelog from 'src/components/Dashboard/Views/Changelog.vue'

const routes = [
  {
    path: '/',
    component: DashboardLayout,
    redirect: 'censure',
    children: [
      {
        path: 'censure',
        name: 'Censure du jour',
        component: Overview
      },
      {
        path: 'statistiques',
        name: 'Stats sur les topics supprimés',
        component: Statistiques
      },
      {
        path: 'affluence',
        name: 'Stats sur le nombre de connectés',
        component: Affluence
      },
      {
        path: 'changelog',
        name: 'Changelog',
        component: Changelog
      },
      { path: '404', component: NotFound, name: '404 not found'},
    ]
  },
  { path: '*', redirect: '404' }
]

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
function view(name) {
   var res= require('../components/Dashboard/Views/' + name + '.vue');
   return res;
};**/

export default routes
