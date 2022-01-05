<template>
    <el-container v-bind:class="classObj">
      <el-header class="header-layout">
        <header-pane />
      </el-header>
      <el-container class="container-layout">
        <sidebar v-if="isSales" />
        <div class="tags-bar clearfix" :class="isDataView?'tags-color':''" v-if="isSales">
              <div class="tags-btn" :class="!sidebar.opened?'btn-active':''"><hamburger v-bind:is-fold="!sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" /></div>
              <div class="tags-list"><tags-view  /></div>
          </div>
        <el-main :style="{'margin-top':isSales?'48px':''}" class="main-layout" v-if="isRefresh">
          <transition name="fade-transform" mode="out-in">
              <router-view :key="key"></router-view>
            </transition>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
import { Sidebar, HeaderPane ,TagsView} from './components/index';
import ResizeMixin from './mixin/ResizeHandler'
import { mapState,mapGetters } from 'vuex';
import Hamburger from '@/components/Hamburger';
import Cookies from 'js-cookie'
export default {
  name: 'Layout',
  components: {
    Sidebar,
    HeaderPane,
    TagsView,
    Hamburger
  },
  mixins: [ResizeMixin],
  data(){
    return{
      isRefresh:true,
      screenWidth:0,
      isSales:true,
      isDataView:false,
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
        foldSidebar: !this.sidebar.opened,
        unfoldSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        iMax:this.device=='iMax',
        web:this.device=='desktop',
        mobile:this.device=='mobile',
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
    };
    this.setTagesColor()
  },
  mounted(){
      const $this = this;
      window.refresh_rout_comp = $this.reload.bind(this);
  },
  watch: {
    $route() {
        this.setTagesColor()
        
    },
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
    //设置tags
    setTagesColor(){
      if(this.$route.path.indexOf('dataOverview')>-1){
        this.isDataView = true;
      }else{
        this.isDataView = false;
      }
    },
    // 侧边导航伸缩
    toggleSideBar() {
      var $this = this;
      $this.$store.dispatch('app/toggleSideBar')
    },
    // 递归寻找有子导航的菜单，将其path存入数据
    findHasChildrenMenu(dataArr){
      var $this = this;
      dataArr.forEach(function(item){
        if(item.children.length>0){
          $this.openedSubMenu.push(item.meta.index);
        }
      });
    },
    reload(){
      this.isRefresh = false;
      this.$nextTick(()=>this.isRefresh = true)
    }
  }
}
</script>

<style lang="scss" scoped>
.tags-bar{
    position: fixed;
    z-index: 1012;
    width: calc(100% - 220px);
    right: 0;
    border-top: 1px solid #d8dce5;
    border-bottom: 1px solid #d8dce5;
    top: 50px;
    transition: width .28s;
    background: #fff;
    // box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
    .tags-btn{
      width: 48px;
      text-align: center;
      line-height: 48px;
      float: left;
      cursor: pointer;
    }
    .tags-list{
      float: left;
      width: calc(100% - 48px);
    }
    .fold-button{
      transition: all .3s;
      font-size: 14px;
    }
    .btn-active .fold-button{
      transform: rotate(180deg);
    }
  }
.tags-color{
  border-top: 1px solid #12182b;
  background: #12182b;
  border-bottom: 1px solid #12182b;
  // box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
  .fold-button{
    color: #a2acc1;
  }
 
}
.foldSidebar .tags-bar{
  width: calc(100% - 60px);
} 
</style>