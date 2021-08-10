<template>
    <el-container v-bind:class="classObj">
      <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" ></div>
      <el-header class="header-layout">
        <header-pane />
      </el-header>
      <el-container class="container-layout">
        <sidebar />
        <el-main class="main-layout" v-if="isRefresh">
            <transition name="fade-transform" mode="out-in">
              <router-view :key="key"></router-view>
            </transition>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
import { Sidebar, HeaderPane } from './components/index';
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'
export default {
  name: 'Layout',
  components: {
    Sidebar,
    HeaderPane,
  },
  mixins: [ResizeMixin],
  data(){
    return{
      isRefresh:true,
      screenWidth:0,
    }
  },
  computed:{
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  },
  mounted(){
      const $this = this;
      window.refresh_rout_comp = $this.reload.bind(this);
  },
  watch: {
    //   screenWidth(val) {
    //   if (val < 1024) {
    //     this.$store.dispatch('handleHideSystemTime')
    //   } else {
    //     this.$store.dispatch('handleShowSystemTime')
    //   }
    // }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    reload(){
      this.isRefresh = false;
      this.$nextTick(()=>this.isRefresh = true)
    }
  }
}
</script>

