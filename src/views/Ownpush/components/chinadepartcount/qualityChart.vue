<template>
    <div class="item-row quality-chart flex-box">
      <div class="item-column flex-content flex-box flex-column">
          <div class="item-quality">
              <div class="column-header">
                  <div class="txt-header">
                      <strong>{{currentData.title}}</strong>
                  </div>
              </div>
              <div class="column-body">
                    <div class="pie-panel">
                        <pie-chart
                          :chart-data="currentData.mainDate"
                          :id-data="currentData.randomStr"
                          :color-data="currentData.inquiryCountColor"
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
                    border
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