<template>
    <div class="page-root flex-box no-padding web-msg" ref="boxPane">
        <div class="homeLeft" :class="currentShrink?'':'Shrink'">
            <el-scrollbar v-if='currentShrink' wrap-class="scrollbar-wrapper">
                <home-left />
            </el-scrollbar>
            <p class="homeLeftArrow" v-on:click="handleShrink"><i></i></p>
        </div>
        <div class="homeMain flex-content">CH-数据总览
        </div>
    </div>
</template>

<script>
import HomeLeft from "../../compoents/HomeLeft";
export default {
  name: "dataOverview",
  data(){
      return{
        currentShrink:true,
      }
  },
  components: {
    HomeLeft,
  },
  methods: {
    handleShrink(){
      var $this = this;
      $this.currentShrink=!$this.currentShrink;
    },
  }
}
</script>

