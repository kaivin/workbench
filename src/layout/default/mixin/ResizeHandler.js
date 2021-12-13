import store from '@/store'

const { body } = document
const WIDTH = 1024 // refer to Bootstrap's responsive design

export default {
  watch: {
    $route(route) {
      if (this.device === 'mobile' && this.sidebar.opened) {
        store.dispatch('app/closeSideBar', { withoutAnimation: false })
      }
    }
  },
  beforeMount() {
    window.addEventListener('resize', this.$_resizeHandler)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.$_resizeHandler)
  },
  mounted() {
    const isMobile = this.$_isMobile();
    const isIMax = this.$_isIMax();
    const isDesktop = this.$_isDesktop();
    if (isMobile) {
      body.setAttribute("device", 'mobile');
      store.dispatch('app/toggleDevice', 'mobile')
      store.dispatch('app/closeSideBar', { withoutAnimation: true })
    }else{
      if(isIMax){
        body.setAttribute("device", 'iMax');
        store.dispatch('app/toggleDevice', 'iMax')
      }else{
        body.setAttribute("device", 'desktop');
      }
    }
  },
  methods: {
    // use $_ for mixins properties
    // https://vuejs.org/v2/style-guide/index.html#Private-property-names-essential
    $_isMobile() {
      const rect = body.getBoundingClientRect()
      return rect.width - 1 < WIDTH
    },
    $_isIMax() {
      const rect = body.getBoundingClientRect()
      return rect.width - 1 >= 1920
    },
    $_isDesktop() {
      const rect = body.getBoundingClientRect()
      return rect.width - 1 < 1920 && rect.width - 1 >= WIDTH
    },
    $_resizeHandler() {
      if (!document.hidden) {
        const isMobile = this.$_isMobile()
        const isIMax = this.$_isIMax();
        const isDesktop = this.$_isDesktop();
        store.dispatch('app/toggleDevice', isMobile ? 'mobile' : isIMax ? 'iMax': 'desktop')
        if (isMobile) {
          body.setAttribute("device", 'mobile');
          store.dispatch('app/closeSideBar', { withoutAnimation: true })
        }
        if(isIMax){
          body.setAttribute("device", 'iMax');
        }
        if(isDesktop){
          body.setAttribute("device", 'desktop');
        }
      }
    }
  }
}
