<template>
    <div class="logo" :class="{'collapse':collapse}">
       <router-link class="logo-link" to="/">
          <img class="logo-img" v-bind:src="logo" alt="">
          <span class="logo-title">{{title}}</span>
        </router-link>
    </div>
</template>

<script>
import logo from "@/assets/logo.png";
const defaultSettings = require('@/settings.js');
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: defaultSettings.title,
      logo: logo
    }
  }
}
</script>


<style lang="scss" scoped>
.logo {
  position: relative;
  width: 100%;
  height: 49px;
  line-height: 49px;
  background: $menuBg;
  overflow: hidden;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .15);
  z-index: 1;
  & .logo-link {
    height: 100%;
    width: 100%;
    transition: all .2s;
    padding-left: 16px;

    & .logo-img {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
      transition: all .2s;
    }

    & .logo-title {
        display: inline-block;
        margin: 0;
        line-height: 49px;
        vertical-align: middle;
        font-size: 20px;
        font-weight:normal;
        color: $menuActiveText;
        transition: all .2s;
    }
  }

  &.collapse {
    .logo-link{
      padding-left:12px;
    }
    .logo-img {
      margin-right: 0px;
    }
    .logo-title{
      font-size:0;
      opacity: 0;
    }
  }
}
</style>