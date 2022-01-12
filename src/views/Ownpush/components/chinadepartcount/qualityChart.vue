<template>
    <div class="item-column flex-content flex-box flex-column">
        <div class="item-quality">
            <div class="column-header">
                <div class="txt-header">
                    <strong>{{currentData.title}}</strong>
                    <span>{{currentData.unit}}</span>
                </div>
            </div>
            <div class="column-body">
                  <div class="pie-panel">
                      <pie-chart
                        :chart-data="currentData.inquiryCount"
                        :id-data="currentData.randomStr1"
                        :color-data="currentData.inquiryCountColor"
                        :font-data="currentData.fontdata"
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
      parentData:{},
    };
  },
  props: {
    itemData: {
      type: Object,
      default:{},
    },
    judgeData:{
      type: Object,
      default: function () {
        return {};
      },
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
  watch: {
    judgeData:{
      handler(newValue, oldValue) {
        this.parentData = newValue;
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