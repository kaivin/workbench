<template>
    <el-aside class="sidebar-container" :class="sidebar.opened?'':'is-fold'">
      <div class="abs-panel">
        <el-scrollbar wrap-class="scrollbar-wrapper">
           <el-tooltip class="item" effect="dark" :content="sidebar.opened?'收起':'展开'" placement="right">
              <hamburger id="hamburger-container" v-if="device=='desktop'" v-bind:is-fold="!sidebar.opened" class="hamburger-container" v-on:toggleClick="toggleSideBar" />
            </el-tooltip>
          <el-menu
              :default-active="activeMenu"
              :collapse="isCollapse"
              :unique-opened="false"
              :collapse-transition="false"
              mode="vertical"
              class="sidebar-menu">
            <sidebar-item v-for="route in menu_data" v-bind:key="route.meta.index" v-bind:item="route" />
          </el-menu>
        </el-scrollbar>
      </div>
    </el-aside>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import Hamburger from '@/components/Hamburger';
import variables from '@/styles/-variables.scss';
export default {
  components: { 
        Hamburger,
        SidebarItem 
  },
  data(){
    return{
    }
  },
  computed:{
      ...mapGetters([
        'menu_data',
        'sidebar',
        'device',
      ]),
      activeMenu(){
        const route = this.$route;
        return route.meta.index;
        // return route.path;
      },
      variables() {
        return variables
      },
      isCollapse() {
        return !this.sidebar.opened
      }
  },
  watch:{
  },
  created() {
  },
  methods:{
    // 侧边导航伸缩
    toggleSideBar() {
        this.$store.dispatch('app/toggleSideBar')
    },
  }
}
</script>
