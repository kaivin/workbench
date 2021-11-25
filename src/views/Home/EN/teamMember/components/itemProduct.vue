<template>
  <div class="item-table">
    <div class="column-header">
      <div class="txt-header">
        <strong>{{currentData.title}}</strong>
        <div class="tab-product">
          <div class="item-tab" :class="currentType=='a'+currentData.randomStr1?'active':''" v-on:click="currentType='a'+currentData.randomStr1">询盘个数</div>
          <div class="item-tab" :class="currentType=='b'+currentData.randomStr2?'active':''" v-on:click="currentType='b'+currentData.randomStr2">成交个数</div>
          <div class="item-tab" :class="currentType=='c'+currentData.randomStr3?'active':''" v-on:click="currentType='c'+currentData.randomStr3">成交积分</div>
        </div>
      </div>
    </div>
    <div class="item-product flex-box">
      <div class="product-panel flex-content">
        <div class="table-panel" :style="{height:isFold?'310px':'auto'}">
          <el-table
            ref="simpleTable"
            :data="currentData.tableData"
            tooltip-effect="dark"
            size="mini"
            stripe
            class="home-table"
            style="width: 100%"
            :default-sort = "{prop: 'inquiryNumber', order: 'descending'}"
            >
            <el-table-column
              prop="name"
              align="center"
              label="产品名"
              min-width="160"
              >
            </el-table-column>
            <el-table-column
              prop="inquiryNumber"
              align="center"
              sortable
              label="询盘个数"
              min-width="110"
              >
            </el-table-column>
            <el-table-column
              prop="dealNumber"
              align="center"
              sortable
              label="成交个数"
              min-width="110"
              >
            </el-table-column>
            <el-table-column
              prop="dealScore"
              align="center"
              sortable
              label="成交积分"
              min-width="110"
              >
            </el-table-column>
          </el-table>
        </div>
        <div class="fold-button" v-if="currentData.tableData.length>6" v-on:click="isFold=!isFold">{{isFold?'点击展开':'点击收起'}}</div>
      </div>
      <div class="product-rank">
        <div class="item-chart" v-show="currentType=='a'+currentData.randomStr1">
          <pie-chart
            :chart-data="currentData.inquiryCount"
            :id-data="currentData.randomStr1"
            :font-data="'产品询盘\n个数占比'"
          ></pie-chart>
        </div>
        <div class="item-chart" v-show="currentType=='b'+currentData.randomStr2">
          <pie-chart
            :chart-data="currentData.dealCount"
            :id-data="currentData.randomStr2"
            :font-data="'产品成交\n个数占比'"
          ></pie-chart>
        </div>
        <div class="item-chart" v-show="currentType=='c'+currentData.randomStr3">
          <pie-chart
            :chart-data="currentData.dealScore"
            :id-data="currentData.randomStr3"
            :font-data="'产品成交\n积分占比'"
          ></pie-chart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import pieChart from "./pieChart.vue";
export default {
  name: "itemProduct",
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
  mounted(){
    console.log("执行表格数据")
  },
  methods:{
  },
};
</script>

<style>
</style>