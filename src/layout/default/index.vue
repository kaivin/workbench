<template>
    <el-container v-bind:class="classObj">
      <el-header class="header-layout">
        <header-pane />
      </el-header>
      <el-container class="container-layout">
        <sidebar v-if="isSales" />
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
import { mapState,mapGetters } from 'vuex'
import Cookies from 'js-cookie'
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
      isSales:true
    }
  },
  metaInfo: {
    meta: [
      // { name: 'viewport', content: 'width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=yes' }
    ]
  },
  computed:{
    ...mapGetters([
      'ModuleList',
      'device'
    ]),
    ...mapState({
      sidebar: state => state.app.sidebar,
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        iMax:this.device=='iMax'
      }
    },
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  },
  created(){
    var $this = this;
    var userInfo = Cookies.get('userInfo');
    userInfo = JSON.parse(userInfo);
    if(userInfo.issales==2){
      $this.isSales=false;
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
    //handleClickOutside() {
    //  this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    //},
    reload(){
      this.isRefresh = false;
      this.$nextTick(()=>this.isRefresh = true)
    }
  }
}
</script>

