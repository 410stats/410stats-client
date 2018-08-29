import Sidebar from './SideBar.vue'

const SidebarStore = {
  showSidebar: false,
  sidebarLinks: [
    {
      name: 'Censure du jour',
      icon: 'ti-announcement',
      path: '/censure'
    },
    {
      name: 'Stats générales',
      icon: 'ti-panel',
      path: '/statistiques'
    },
    {
      name: 'Connectés',
      icon: 'ti-user',
      path: '/affluence'
    }
  ],
  displaySidebar (value) {
    this.showSidebar = value
  }
}

const SidebarPlugin = {

  install (Vue) {
    Vue.mixin({
      data () {
        return {
          sidebarStore: SidebarStore
        }
      }
    })

    Object.defineProperty(Vue.prototype, '$sidebar', {
      get () {
        return this.$root.sidebarStore
      }
    })
    Vue.component('side-bar', Sidebar)
  }
}

export default SidebarPlugin
