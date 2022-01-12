<template>
    <div class="item-column">
        <div class="item-quality">
            <div class="column-header">
                <div class="txt-header">
                    <strong>{{currentData.title}}</strong>
                    <div class="tab-product">
                      <div class="item-tab" :class="currentType=='a'+currentData.randomStr1?'active':''" v-on:click="currentType='a'+currentData.randomStr1">询盘个数</div>
                      <div class="item-tab" :class="currentType=='b'+currentData.randomStr2?'active':''" v-on:click="currentType='b'+currentData.randomStr2">成交积分</div>
                      <div class="item-tab" :class="currentType=='c'+currentData.randomStr3?'active':''" v-on:click="currentType='c'+currentData.randomStr3">消费月份</div>
                    </div>
                </div>
            </div>
            <div class="column-body">
                <div class="item-chart" v-show="currentType=='a'+currentData.randomStr1">
                  <pie-chart
                    :chart-data="currentData.inquiryCount"
                    :id-data="currentData.randomStr1"
                    :color-data="currentData.inquiryCountColor"
                    :font-data="'询盘个数\n占比'"
                  ></pie-chart>
                </div>
                <div class="item-chart" v-show="currentType=='b'+currentData.randomStr2">
                  <pie-chart
                    :chart-data="currentData.dealCount"
                    :id-data="currentData.randomStr2"
                    :color-data="currentData.dealCountColor"
                    :font-data="'成交积分\n占比'"
                  ></pie-chart>
                </div>
                <div class="item-chart" v-show="currentType=='c'+currentData.randomStr3">
                  <pie-chart
                    :chart-data="currentData.dealScore"
                    :id-data="currentData.randomStr3"
                    :color-data="currentData.dealScoreColor"
                    :font-data="'消费月份\n占比'"
                  ></pie-chart>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import pieChart from "../../../stat/components/departGroup/pieChart.vue";
export default {
  name: "qualityChart",
  components: {
    pieChart,
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