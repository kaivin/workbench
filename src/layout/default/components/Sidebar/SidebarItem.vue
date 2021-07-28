<template>
  <div class="item-link" v-if="!item.meta.hidden">
    <el-submenu v-if="item.children&&item.children.length>0" ref="subMenu" :index="item.meta.index">
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path==''?child.id:child.path"
        :is-nest="true"
        :item="child"
        class="nest-menu"
      />
    </el-submenu>
    <el-menu-item v-else :index="item.meta.index" v-on:click="jumpLink(item.path)">
        <item v-if="item.meta" :icon="item.meta&&item.meta.icon" :title="item.meta.title" />
    </el-menu-item>
  </div>
</template>

<script>
import Item from './Item'
export default {
  name: 'SidebarItem',
  components: {Item},
  props: {
    // route object
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return {}
  },
  methods: {
    jumpLink:function(path,index){
      this.$router.push(path);
    }
  }
}
</script>
