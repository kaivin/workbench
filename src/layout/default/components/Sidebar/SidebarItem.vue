<template>
  <div class="item-link" v-bind:class="item.children&&item.children.length>0?'has-children':''" v-if="!item.meta.hidden">
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
    <router-link v-else class="a-link" :to="{path:item.path}" tag="a">
      <el-menu-item :index="item.meta.index">
          <item v-if="item.meta" :icon="item.meta&&item.meta.icon" :title="item.meta.title" />
      </el-menu-item>
    </router-link>
  </div>
</template>

<script>
import Item from './Item';
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
  }
}
</script>