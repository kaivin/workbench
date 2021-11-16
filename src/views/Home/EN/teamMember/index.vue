<template>
  <div class="page-root scroll-panel home-index" ref="boxPane">
    <el-card class="box-card scroll-card" shadow="hover">
        <div class="homeMain flex-content">EN-小组分析</div>
    </el-card>
  </div>
</template>
<script>
export default {
  name: "teamMember",
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



