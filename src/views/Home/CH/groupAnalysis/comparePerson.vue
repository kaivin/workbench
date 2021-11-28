<template>
  <div class="page-root scroll-panel home-index" ref="boxPane">
    <el-card class="box-card scroll-card" shadow="hover">
        <div class="homeMain flex-content personAnalysis">
          <top-tab></top-tab>
          <div class="compareBox">
              <compare-who></compare-who>
              <compare-who></compare-who>
              <div class="addWho">
                  <div class="whoImg"></div>
                  <div class="whoText">添加对比</div>
              </div>
          </div>
          <div class="compareItemBox">
              <compare-inquiry></compare-inquiry>
              <compare-score></compare-score>
              <compare-million></compare-million>
              <compare-award></compare-award>
          </div>
        </div>
    </el-card>
  </div>
</template>
<script>
import CompareWho from "../../compoents/memberDetail/CompareWho"
import CompareInquiry from "../../compoents/memberDetail/CompareInquiry"
import CompareScore from "../../compoents/memberDetail/CompareScore"
import CompareMillion from "../../compoents/memberDetail/CompareMillion"
import CompareAward from "../../compoents/memberDetail/CompareAward"

export default {
  name: "cnComparePerson",
  data() {
    return {
    };
  },
  components:{
    TopTab,
    CompareWho,
    CompareInquiry,
    CompareScore,
    CompareMillion,
    CompareAward
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