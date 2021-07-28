<template>
    <el-container v-bind:class="classObj">
      <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" ></div>
      <sidebar />
      <el-container>
        <el-header>
          <navbar />
          <tags-view />
        </el-header>
        <el-main v-if="isRefresh">
              <transition name="fade-transform" mode="out-in" v-if="$route.meta.keepAlive">
                <keep-alive :include="cachedViews">
                  <router-view :key="key"></router-view>
                </keep-alive>
              </transition>
              <transition name="fade-transform" mode="out-in" v-else>
                <router-view :key="key"></router-view>
              </transition>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
import { Sidebar, Navbar,TagsView,Breadcrumb } from './components/index';
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'
export default {
  name: 'Layout',
  components: {
    Sidebar,
    Navbar,
    TagsView,
    Breadcrumb,
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

<style lang="scss" scoped>
.el-header{
  padding:0!important;
  height: auto!important;
  position: relative;
  z-index: 10;
}
.drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
}
.el-main {
  overflow: hidden!important;
  padding:0!important;
}
</style>
