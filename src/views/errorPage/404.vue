﻿<template>
  <div class="wscn-http404-container">
    <div class="wscn-http404">
      <div class="pic-404">
        <img class="pic-404__parent" src="@/assets/404_images/404.png" alt="404">
        <img class="pic-404__child left" src="@/assets/404_images/404_cloud.png" alt="404">
        <img class="pic-404__child mid" src="@/assets/404_images/404_cloud.png" alt="404">
        <img class="pic-404__child right" src="@/assets/404_images/404_cloud.png" alt="404">
      </div>
      <div class="bullshit">
        <div class="bullshit__oops">OOPS!</div>
        <div class="bullshit__headline">{{ message }}</div>
        <div class="bullshit__info">1. 请检查您输入的网址是否正确。</div>
        <div class="bullshit__info">2. 您可能暂未被授权访问该页面。</div>
        <a href="/" class="bullshit__return-home">返回首页</a>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Page404',
  data() {
    return {
    }
  },
  computed: {
    message() {
      return '进入了一个不存在的页面，可能原因：'
    }
  },
    created(){
    },
  methods: {
  }
}
</script>

<style lang="scss">
</style>
