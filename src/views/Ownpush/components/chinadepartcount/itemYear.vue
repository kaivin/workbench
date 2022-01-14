<template>
    <div class="pie-chart" id='randomStr' :style="'height:'+scoreHeight+'px'" ></div>
</template>

<script>
import * as echarts from 'echarts';
export default {
  name: "pieChart",
  data:function() {
    return {
        myChart:null,
    };
  },
  props: {
    chartData: {
      type: Array,
      default:[],
    },
    departArr: {
      type: Array,
      default:[],
    },
    yarnArr: {
      type: Array,
      default:[],
    },
    yarnClinch: {
      type: Array,
      default:[],
    },
    scoreHeight:{
      type: Number,
      default: "",
    },
    idData:{
      type: String,
      default: "",
    },
  },
  computed:{
    currentData(){
      return this.chartData;
    },
  },
  watch:{
    chartData:{
      handler(newValue, oldValue) {
          this.drawAreaTrendChart();
      },
      deep: true
    },
  },
  mounted(){
    var $this = this;
    window.addEventListener('resize',this.echartsSize);
    $this.drawAreaTrendChart();
  },
  methods: {
    drawAreaTrendChart() {
        var $this = this;
        var chartDom = document.getElementById('randomStr');
        var myChart = echarts.init(chartDom);
        var series=[];
        $this.yarnArr.forEach(function(item,index){
          $this.yarnClinch.forEach(function(itemk,indexk){
            var itemObj={};
            itemObj.name=itemk;
            itemObj.type='bar';
            itemObj.barWidth=25;
            itemObj.stack=item;
            itemObj.data=[];
            $this.chartData.forEach(function(items,indexs){
              if(item==items.time&&itemk==items.yeartime){
                itemObj.data.push(items.value);
              }
            });
            series.push(itemObj);
          });
        });
        var option;
        var legend=false;
        option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: 30,
            right:30,
            bottom: 0,
            top: 20,
            containLabel: true
          },
          xAxis:{
              type: 'category',
              data: $this.departArr,
              axisLine: {
                  show: false,
              },
              axisTick: {
                  show: false,
              },
              axisLine:{
                  show: true,
                  lineStyle:{
                      type: [4, 0],
                      dashOffset: 3,
                      color: '#e5e5e5',
                      opacity: 1,
                      shadowColor: null,
                      shadowBlur: 0,
                      shadowOffsetX: 0,
                      shadowOffsetY: 0,
                  }
              },
              axisLabel: {
                  color: "#555",
                  fontSize: "12",
                  lineHeight: 18,
              },
          },
          yAxis: [
            {
              type: 'value',
              splitNumber:3,
              splitLine:{
                  show: true,
                  lineStyle:{
                      type: [4, 2],
                      dashOffset: 3,
                      color: '#f6f6f6',
                      opacity: 1,
                      shadowColor: null,
                      shadowBlur: 0,
                      shadowOffsetX: 0,
                      shadowOffsetY: 0,
                  }
              },
            }
          ],
          legend:legend,
          series:series
        };
        option && myChart.setOption(option);
        $this.myChart = myChart;
    },
    echartsSize(){
        if(this.myChart){
            this.myChart.resize();
        }
    }
  },
  destroyed(){
    window.removeEventListener('resize',this.echartsSize);
    if(this.myChart){
        this.myChart.dispose();
    }
  },
}
</script>

<style></style>