<template>
  <div class="item-yarn">
    <div class="column-header">
      <div class="txt-header">
        <strong>{{currentData.title}}</strong>
        <div class="tab-product" v-if='!currentData.isYear'>
          <div class="item-tab" :class="currentType=='a'+currentData.randomStr1?'active':''" v-on:click="currentType='a'+currentData.randomStr1">月</div>
          <div class="item-tab" :class="currentType=='b'+currentData.randomStr2?'active':''" v-on:click="currentType='b'+currentData.randomStr2">年</div>
        </div>
      </div>
    </div>
    <div class="column-body flex-box">
        <div class="column-chart" v-show="currentType=='a'+currentData.randomStr1">
            <column-chart
              :chart-data="currentData.inquiryMonthCount"
              :id-data="currentData.randomStr1"
              :iscost="currentData.isCost"
            ></column-chart>
        </div>
        <div class="column-chart" v-if='!currentData.isYear' v-show="currentType=='b'+currentData.randomStr2">
            <column-chart
              :chart-data="currentData.inquiryYearCount"
              :id-data="currentData.randomStr2"
              :iscost="currentData.isCost"
            ></column-chart>
        </div>
    </div>
  </div>
</template>

<script>
import columnChart from "./columnChart.vue";
export default {
  name: "itemYear",
  components: {
    columnChart,
  },
  data:function() {
    return {
      isFold:true,
      currentType:"a"+this.itemData.randomStr1,
    };
  },
  props: {
    itemData: {
      type: Object,
      default:{},
    },
  },
  computed:{
    currentData(){
      return this.itemData;
    },
  },
  watch: {
    itemData:{
      handler(newValue, oldValue) {
        this.itemData = newValue;
      },
      deep: true,
      immediate:true
    },
  },
  mounted(){
  },
  methods:{
  },
};
</script>

<style></style>