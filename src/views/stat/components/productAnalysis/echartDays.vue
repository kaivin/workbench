<template>
  <div class="enquirieTrend areaBox">
      <p class="enquirieTrendTit">
          {{enquirieChart.TagName}}
          <span v-if="contrastTag=='overview'">统计时间：近30天</span>
      </p>
      <div class="enquirieTrendBox">
          <div :id="'cluesChart'+enquirieChart.randomStr" :style="'height:'+scoreHeight+'px'" class="chart-canvas"></div>
          <div class="trendlegend" v-if="contrastTag=='overview'">
              <span class="legendItem1" v-for="item in enquirieChart.chartName" :key='item'>{{item}}</span>
              <span class="legendItem2">平均值</span>
          </div>
      </div>          
  </div>
</template>

<script>
import * as echarts from 'echarts';
require('echarts/theme/macarons') // echarts theme
export default {
  name: "demo",
  data() {
    return {
        myChart:null,
    };
  },
  props: {
    enquirieChart:{
      type: Object,
      default: function () {
        return {};
      },
    },
    contrastTag:{
      type: String,
      default: "",
    },
    scoreHeight:{
      type: Number,
      default: "",
    }
  },
  destroyed(){
    window.removeEventListener('resize',this.echartsSize);
    if(this.myChart){
        this.myChart.dispose();
    }
  },
  mounted(){
      var $this = this;
      window.addEventListener('resize',$this.echartsSize);
      this.drawAreaTrendChart();
  },
  methods: {
    // 近30天询盘统计趋势图
    drawAreaTrendChart() {
      var $this = this;
        var chartDom = document.getElementById('cluesChart'+$this.enquirieChart.randomStr);
        var myChart = echarts.init(chartDom, 'macarons');
        var series=[];
        if($this.enquirieChart.enquirieArr&&$this.enquirieChart.enquirieArr.length>0){
          $this.enquirieChart.enquirieArr.forEach(function(item,index){
              var itemObj={};
              itemObj.name=$this.enquirieChart.chartName[index];
              itemObj.smooth=false;
              itemObj.showSymbol=false;
              itemObj.type='line';
              itemObj.lineStyle={
                normal: {
                    width: 2,
                    color:$this.enquirieChart.ChartColor[index], // 线条颜色
                },
              },
              itemObj.areaStyle={
                normal: {
                    color:$this.enquirieChart.ChartColor[index],
                    opacity:0.05,
                },
              },
              itemObj.data=item;
              itemObj.animationDuration=2800;
              itemObj.animationEasing='quadraticOut';
              series.push(itemObj);
          });
        }
        var option;
        option = {
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "line", 
                },
            },
            grid: {
                left: 10,
                right: 40,
                bottom: 20,
                top: 30,
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: $this.enquirieChart.TagTime,
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                axisLabel: {
                    color: "#555",
                    fontSize: "12",
                    lineHeight: 18,
                },
            },
            yAxis: {
                type: 'value',
                axisTick: {
                    show: false
                },
                axisLabel: {
                    color: "#555",
                    fontSize: "12",
                },
                splitLine:{
                    show: true,
                    lineStyle:{
                        type: [4, 3],
                        dashOffset: 3,
                        color: '#000',
                        opacity: 0.02,
                        shadowColor: null,
                        shadowBlur: 0,
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                    }
                },
                splitNumber:3,
                nameTextStyle:{
                    lineHeight:20,
                }
            },
            series:series,
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
};
</script>

<style>
</style>