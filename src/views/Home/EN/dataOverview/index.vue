<template>
    <div class="page-root flex-box no-padding web-msg" ref="boxPane">
        <div class="homeLeft">
            <el-scrollbar wrap-class="scrollbar-wrapper">
                <home-left />
            </el-scrollbar>
        </div>
        <div class="homeMain">EN-数据总览
        </div>
    </div>
</template>

<script>
import HomeLeft from "../../compoents/HomeLeft";
export default {
  name: "dataOverview",
  components: {
    HomeLeft,
  },
  methods: {
  }
}
</script>

