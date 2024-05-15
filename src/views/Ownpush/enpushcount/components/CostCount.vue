<template>
  <div class="rowDayScore rowDayCount">
    <div class="rowTitle">
      <div class="title-left">
        <h3 class="tit-h3">本月预算</h3>
        <span class="tit-span">（单位：元）</span>
      </div>
    </div>
    <div class="rowMain">
      <ul class="rowCountItem">
        <li>
          <p>昨日花费<span>{{ CostCount.prevCost }}</span></p>
        </li>
        <li>
          <p>剩余日均预算<span>{{ CostCount.lastAvaCost }}</span></p>
        </li>
        <li>
          <p>本月平均预算<span>{{ CostCount.monthAvaCost }}</span></p>
        </li>
        <li>
          <p>总预算<span>{{ CostCount.totalCost }}</span></p>
        </li>
      </ul>

    </div>
  </div>
</template>

<script>

export default {
  name: "CostCount",
  data() {
    return {

    };
  },
  created(){
    
  },
  props: {
    CostCount: {
      type: Object,
      default: function () {
        return {};
      },
    }
  }
};
</script>

<style>
</style>