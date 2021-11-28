<template>
  <div class="page-root scroll-panel home-index" ref="boxPane">
    <el-card class="box-card scroll-card" shadow="hover">
        <div class="homeMain flex-content personAnalysis">
          <top-tab></top-tab>
          <div class="middleBox">
              <person-intro></person-intro>
              <div class="middleRight">
                  <year-chart></year-chart>
                  <score-num></score-num>
              </div>
          </div>
        </div>
    </el-card>
  </div>
</template>
<script>
import TopTab from "../../compoents/memberDetail/TopTab"
import PersonIntro from "../../compoents/memberDetail/PersonIntro"
import YearChart from "../../compoents/memberDetail/YearChart"
import ScoreNum from "../../compoents/memberDetail/ScoreNum"
export default {
  name: "cnSinglePerson",
  data() {
    return {
    };
  },
  components:{
    TopTab,
    PersonIntro,
    YearChart,
    ScoreNum
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



