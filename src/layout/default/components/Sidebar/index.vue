<template>
    <el-aside class="sidebar-container" :class="sidebar.opened?'':'is-fold'">
      <div class="abs-panel">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <el-tooltip class="item" effect="dark" :content="sidebar.opened?'收起':'展开'" placement="right">
            <hamburger id="hamburger-container" v-bind:is-fold="!sidebar.opened" class="hamburger-container" v-on:toggleClick="toggleSideBar" />
          </el-tooltip>
          <el-menu
              :default-active="activeMenu"
              :collapse="isCollapse"
              :default-openeds="openedSubMenu"
              :unique-opened="false"
              :collapse-transition="false"
              mode="vertical"
              class="sidebar-menu">
            <sidebar-item v-for="route in menuData" v-bind:key="route.meta.index" v-bind:item="route" />
          </el-menu>
        </el-scrollbar>
      </div>
    </el-aside>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import Hamburger from '@/components/Hamburger';
export default {
  components: { 
        Hamburger,
        SidebarItem 
  },
  data(){
    return{
      openedSubMenu:[],
    }
  },
  computed:{
      ...mapGetters([
        'menuData',
        'sidebar',
      ]),
      activeMenu(){
        const route = this.$route;
        return route.meta.index;
        // return route.path;
      },
      isCollapse() {
        return !this.sidebar.opened
      }
  },
  watch:{
  },
  mounted(){
    var $this = this;
    $this.openedSubMenu = [];
    $this.findHasChildrenMenu($this.menuData);
  },
  created() {
  },
  methods:{
    // 侧边导航伸缩
    toggleSideBar() {
      var $this = this;
      $this.$store.dispatch('app/toggleSideBar').then(()=>{
        if($this.sidebar.opened){
          $this.openedSubMenu = [];
          $this.findHasChildrenMenu($this.menuData);
        }
      });
    },
    // 递归寻找有子导航的菜单，将其path存入数据
    findHasChildrenMenu(dataArr){
      var $this = this;
      dataArr.forEach(function(item){
        if(item.children.length>0){
          $this.openedSubMenu.push(item.meta.index);
        }
      });
    }
  }
}
</script>
