<template>
    <div class="item-row quality-chart flex-box">
      <div class="item-column flex-content flex-box flex-column">
          <div class="item-quality">
              <div class="column-header">
                  <div class="txt-header">
                      <strong>{{currentData.title}}——{{currentData.moneyDate.name}}</strong>
                      <span>{{currentData.moneyDate.unit}}</span>
                  </div>
              </div>
              <div class="column-body">
                    <div class="pie-panel">
                        <pie-chart
                          :chart-data="currentData.moneyDate.mainDate"
                          :id-data="currentData.randomStr1"
                          :color-data="currentData.inquiryCountColor"
                          :tagName="currentData.moneyDate.name"
                          :tagUnit="currentData.moneyDate.unit"
                          :tagUnitend="currentData.moneyDate.unitEnd"
                          :scoreHeight="350"
                        ></pie-chart>
                    </div>
              </div>
          </div>
      </div>
      <div class="item-column flex-content flex-box flex-column">
          <div class="item-quality">
              <div class="column-header">
                  <div class="txt-header">
                      <strong>{{currentData.title}}——{{currentData.enquirieDate.name}}</strong>
                      <span>{{currentData.enquirieDate.unit}}</span>
                  </div>
              </div>
              <div class="column-body">
                    <div class="pie-panel">
                        <pie-chart
                          :chart-data="currentData.enquirieDate.mainDate"
                          :id-data="currentData.randomStr2"
                          :color-data="currentData.inquiryCountColor"
                          :tagName="currentData.enquirieDate.name"
                          :tagUnit="currentData.enquirieDate.unit"
                          :tagUnitend="currentData.enquirieDate.unitEnd"
                          :scoreHeight="350"
                        ></pie-chart>
                    </div>
              </div>
          </div>
      </div>
      <div class="item-column flex-content flex-box flex-column">
          <div class="item-quality">
              <div class="column-header">
                  <div class="txt-header">
                      <strong>{{currentData.title}}——{{currentData.scoreDate.name}}</strong>
                      <span>{{currentData.scoreDate.unit}}</span>
                  </div>
              </div>
              <div class="column-body">
                    <div class="pie-panel">
                        <pie-chart
                          :chart-data="currentData.scoreDate.mainDate"
                          :id-data="currentData.randomStr3"
                          :color-data="currentData.inquiryCountColor"
                          :tagName="currentData.scoreDate.name"
                          :tagUnit="currentData.scoreDate.unit"
                          :tagUnitend="currentData.scoreDate.unitEnd"
                          :scoreHeight="350"
                        ></pie-chart>
                    </div>
              </div>
          </div>
      </div>
      <div class="item-column flex-content flex-box">
          <div class="qualityTable">  
               <div class="qualityTableTop" :style="'height:'+currentData.tableHeight">  
                  <el-table
                    :data="currentData.tableDate"
                    tooltip-effect="dark"
                    class="quaTable"
                    border
                    stripe
                    style="width: 100%">
                    <el-table-column
                      prop="date"
                      label="日期"
                      width="100">
                    </el-table-column>
                    <el-table-column
                      prop="xunnumber"
                      label="询盘个数">
                    </el-table-column>
                    <el-table-column
                      prop="score"
                      label="成交积分">
                    </el-table-column>
                    <el-table-column
                      prop="money"
                      label="消费">
                    </el-table-column>
                  </el-table>
               </div>
               <p class="qualityTableBom" :class="currentData.isTable?'active':''" v-if="currentData.tableBom"><span @click="handleTable">查看更多</span></p> 
          </div>  
      </div>
    </div>
</template>
<script>
import pieChart from "./pieChart.vue";
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
    handleTable(){
      var $this=this;
      $this.currentData.isTable = !$this.currentData.isTable;
      var boxHeight = '';
      if($this.currentData.isTable){
        $this.currentData.tableHeight='auto';
      }else{
        $this.currentData.tableHeight='351px';
      }
    }
  },
};
</script>

<style></style>