<template>
    <el-aside class="sidebar-container">
        <logo :collapse="isCollapse" />
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <el-menu
              :default-active="activeMenu"
              :collapse="isCollapse"
              :unique-opened="false"
              :collapse-transition="false"
              mode="vertical"
              class="sidebar-menu"
          >
            <sidebar-item v-for="route in menu_data" v-bind:key="route.meta.index" v-bind:item="route" />
          </el-menu>
        </el-scrollbar>
    </el-aside>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo';
import SidebarItem from './SidebarItem'
import variables from '@/styles/-variables.scss';
export default {
  components: { SidebarItem,Logo },
  data(){
    return{
    }
  },
  computed:{
      ...mapGetters([
        'menu_data',
        'sidebar'
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
  }
}
</script>
<style lang="scss" scoped>
</style>
