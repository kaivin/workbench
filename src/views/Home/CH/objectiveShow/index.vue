<template>
  <div class="page-root scroll-panel home-index" ref="boxPane">
    <el-card class="box-card scroll-card" shadow="hover">
        <div class="homeMain flex-content">CH-目标展示
        </div>
    </el-card>
  </div>
</template>
<script>
export default {
  name: "objectiveShow",
  data() {
    return {
    };
  },
  created() {
    var $this = this;
    $this.initData();
  },
  methods: {
    // 初始化数据
    initData() {
      var $this = this;
    },
  }
}
</script>

